import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { messagesAPI } from '../../api/messages'
import { techniciansAPI } from '../../api/technicians'
import { adminAPI } from '../../api/admin'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../hooks/useSocket'
import { Avatar, Spinner, EmptyState } from '../../components/ui'
import { formatTime } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function ChatPage() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const withId = searchParams.get('with')

  const [contacts, setContacts]         = useState([])
  const [selectedContact, setSelected]  = useState(null)
  const [messages, setMessages]         = useState([])
  const [text, setText]                 = useState('')
  const [loadingContacts, setLContacts] = useState(true)
  const [loadingMsgs, setLMsgs]        = useState(false)
  const [search, setSearch]             = useState('')
  const bottomRef                       = useRef(null)

  // Load contacts
  useEffect(() => {
    const loadContacts = async () => {
      try {
        let list = []
        if (user.role === 'user') {
          const res = await techniciansAPI.getAll()
          list = res.data
        } else if (user.role === 'technician') {
          const res = await techniciansAPI.getCustomers()
          list = res.data
        } else {
          const res = await adminAPI.getUsers()
          list = res.data.filter(u => u._id !== user._id)
        }
        setContacts(list)
        if (withId) {
          const found = list.find(c => c._id === withId)
          if (found) setSelected(found)
        }
      } catch {
        toast.error('Could not load contacts')
      } finally {
        setLContacts(false)
      }
    }
    loadContacts()
  }, [user.role, user._id, withId])

  // Socket: receive messages
  const handleIncoming = useCallback((data) => {
    if (!selectedContact) return
    const myId = user._id
    const them = selectedContact._id
    const isRelevant =
      (data.senderId === them && data.receiverId === myId) ||
      (data.senderId === myId && data.receiverId === them)
    if (!isRelevant) return
    setMessages(prev => {
      // deduplicate optimistic messages
      const exists = prev.some(m => m._optimistic &&
        m.text === data.text && m.sender === myId)
      if (exists) {
        return prev.map(m =>
          (m._optimistic && m.text === data.text && m.sender === myId)
            ? { ...m, _optimistic: false }
            : m
        )
      }
      return [...prev, {
        _id: Date.now() + Math.random(),
        sender: data.senderId,
        receiver: data.receiverId,
        text: data.text,
        createdAt: new Date().toISOString(),
      }]
    })
  }, [selectedContact, user._id])

  const { emit } = useSocket('receiveMessage', handleIncoming)

  // Load message history
  useEffect(() => {
    if (!selectedContact) return
    setLMsgs(true)
    setMessages([])
    messagesAPI.getHistory(selectedContact._id)
      .then(res => setMessages(res.data))
      .catch(() => {})
      .finally(() => setLMsgs(false))
  }, [selectedContact?._id])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(() => {
    if (!text.trim() || !selectedContact) return
    const payload = {
      senderId: user._id,
      receiverId: selectedContact._id,
      text: text.trim(),
    }
    // optimistic
    setMessages(prev => [...prev, {
      _id: Date.now(),
      sender: user._id,
      receiver: selectedContact._id,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      _optimistic: true,
    }])
    emit('sendMessage', payload)
    setText('')
  }, [text, selectedContact, user._id, emit])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const selectContact = (c) => {
    setSelected(c)
    setSearchParams({ with: c._id })
  }

  const filteredContacts = contacts.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return c.name?.toLowerCase().includes(q) || c.service?.toLowerCase().includes(q)
  })

  const chatBg = 'bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.04),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.06),transparent_60%)]'

  return (
    <div className={`flex h-[calc(100vh-57px)] lg:h-[calc(100vh-65px)] ${chatBg}`}>

      {/* ── Contacts panel ── */}
      <div className={`${selectedContact ? 'hidden sm:flex' : 'flex'} flex-col w-full sm:w-72 border-r border-dark-100 dark:border-dark-800 bg-white dark:bg-dark-900 shrink-0`}>
        <div className="px-4 pt-4 pb-3 border-b border-dark-100 dark:border-dark-800">
          <h2 className="font-display font-bold text-dark-900 dark:text-dark-100 mb-2.5">Messages</h2>
          <input
            className="input text-xs py-2"
            placeholder="Search contacts…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {loadingContacts ? (
            <div className="p-3 space-y-1">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-center gap-2.5 p-2.5">
                  <div className="w-9 h-9 skeleton rounded-xl shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 skeleton rounded w-2/3" />
                    <div className="h-2.5 skeleton rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredContacts.length === 0 ? (
            <EmptyState icon="👥" title="No contacts" description={search ? 'No matches.' : 'No users found.'} />
          ) : (
            filteredContacts.map(c => (
              <button
                key={c._id}
                onClick={() => selectContact(c)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors text-left group ${
                  selectedContact?._id === c._id
                    ? 'bg-brand-500/8 dark:bg-brand-500/12 border-r-2 border-brand-500'
                    : ''
                }`}
              >
                <div className="relative">
                  <Avatar name={c.name} size="sm" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-dark-900" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium truncate transition-colors ${
                    selectedContact?._id === c._id
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-dark-900 dark:text-dark-100'
                  }`}>{c.name}</p>
                  <p className="text-xs text-dark-400 dark:text-dark-500 truncate">
                    {c.service || (c.role === 'user' ? 'Customer' : c.role)}
                    {c.location?.city && ` · ${c.location.city}`}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Chat area ── */}
      <div className={`${selectedContact ? 'flex' : 'hidden sm:flex'} flex-1 flex-col min-w-0`}>
        {!selectedContact ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center text-3xl">💬</div>
            <h3 className="font-display font-semibold text-dark-700 dark:text-dark-300">Select a conversation</h3>
            <p className="text-sm text-dark-400 dark:text-dark-500 max-w-xs">
              Choose a {user.role === 'user' ? 'technician' : 'contact'} from the list to start chatting
            </p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-dark-900 border-b border-dark-100 dark:border-dark-800 shrink-0">
              <button
                onClick={() => { setSelected(null); setSearchParams({}) }}
                className="sm:hidden btn-ghost p-1.5 -ml-1 text-sm"
              >
                ←
              </button>
              <div className="relative">
                <Avatar name={selectedContact.name} size="sm" />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-dark-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-dark-900 dark:text-dark-100 truncate">{selectedContact.name}</p>
                <p className="text-xs text-dark-400 dark:text-dark-500 truncate">
                  {selectedContact.service || selectedContact.role}
                  {selectedContact.location?.city && ` · 📍 ${selectedContact.location.city}`}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-dark-400 dark:text-dark-500">Online</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-3">
              {loadingMsgs ? (
                <div className="flex justify-center py-10"><Spinner /></div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                  <Avatar name={selectedContact.name} size="lg" />
                  <p className="font-medium text-sm text-dark-700 dark:text-dark-300 mt-1">
                    Start a conversation with {selectedContact.name}
                  </p>
                  <p className="text-xs text-dark-400 dark:text-dark-500">
                    Messages are private and end-to-end stored
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => {
                    const senderId = msg.sender?._id || msg.sender || msg.senderId
                    const isMe = senderId === user._id
                    const showAvatar = !isMe && (i === 0 || (messages[i-1]?.sender?._id || messages[i-1]?.sender) !== senderId)

                    return (
                      <div key={msg._id || i} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        {!isMe && (
                          <div className="w-7 shrink-0">
                            {showAvatar && <Avatar name={selectedContact.name} size="sm" className="w-7 h-7 text-xs" />}
                          </div>
                        )}
                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                            isMe
                              ? `bg-brand-500 text-white rounded-br-sm ${msg._optimistic ? 'opacity-70' : ''}`
                              : 'bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100 shadow-sm rounded-bl-sm border border-dark-100 dark:border-dark-700'
                          }`}>
                            {msg.text}
                          </div>
                          <span className="text-xs text-dark-300 dark:text-dark-600 mt-0.5 px-1">
                            {formatTime(msg.createdAt)}
                            {msg._optimistic && ' · sending…'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={bottomRef} />
                </>
              )}
            </div>

            {/* Input bar */}
            <div className="px-4 py-3 bg-white dark:bg-dark-900 border-t border-dark-100 dark:border-dark-800 shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  rows={1}
                  className="input flex-1 resize-none min-h-[42px] max-h-[120px] leading-relaxed py-2.5"
                  placeholder={`Message ${selectedContact.name}…`}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={handleKey}
                />
                <button
                  onClick={sendMessage}
                  disabled={!text.trim()}
                  className="btn-primary p-2.5 rounded-xl shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-dark-300 dark:text-dark-700 mt-1.5">
                Enter to send · Shift+Enter for new line
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
