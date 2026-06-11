import { Link } from 'react-router-dom'
import { Avatar, StarRating } from './ui'

export default function TechnicianCard({ technician, avgRating, reviewCount }) {
  return (
    <div className="card card-hover p-5 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <Avatar name={technician.name} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-dark-900 dark:text-dark-100 truncate">{technician.name}</h3>
          {technician.service && (
            <span className="badge badge-brand mt-1">{technician.service}</span>
          )}
        </div>
      </div>

      {technician.bio && (
        <p className="text-xs text-dark-500 dark:text-dark-400 leading-relaxed line-clamp-2">{technician.bio}</p>
      )}

      <div className="flex items-center gap-3 text-xs text-dark-400 dark:text-dark-500 flex-wrap">
        {technician.location?.city && (
          <span>📍 {technician.location.city}{technician.location.area ? `, ${technician.location.area}` : ''}</span>
        )}
        {technician.yearsOfExperience && (
          <span>⏱ {technician.yearsOfExperience}yr{technician.yearsOfExperience !== 1 ? 's' : ''} exp</span>
        )}
      </div>

      {avgRating != null && (
        <div className="flex items-center gap-2">
          <StarRating value={Math.round(avgRating)} readonly />
          <span className="text-xs text-dark-400 dark:text-dark-500">
            {avgRating.toFixed(1)} ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
          </span>
        </div>
      )}

      <Link
        to={`/technicians/${technician._id}`}
        className="btn-secondary text-xs py-2 justify-center mt-auto"
      >
        View Profile
      </Link>
    </div>
  )
}
