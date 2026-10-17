import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import './App.css'

function JobDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function fetchJob() {
      try {
       const response = await fetch(
  'https://jobconnect-backend-m20c.onrender.com/api/jobs/'
)

        if (!response.ok) {
          throw new Error('Failed to fetch jobs')
        }

        const data = await response.json()

        const jobs = Array.isArray(data)
          ? data
          : Array.isArray(data.results)
            ? data.results
            : []

        const selectedJob = jobs.find(
          (item) => String(item.id) === id
        )

        if (!isMounted) return

        if (selectedJob) {
          setJob(selectedJob)
          setError('')
        } else {
          setError('Job not found.')
        }
      } catch (err) {
        if (isMounted) {
          setError('Unable to load job details.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchJob()

    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) {
    return (
      <main className="jobs-section details-page">
        <p className="message">Loading job details...</p>
      </main>
    )
  }

  if (error || !job) {
    return (
      <main className="jobs-section details-page">
        <p className="message error">
          {error || 'Job not found.'}
        </p>

        <Link to="/" className="back-link">
          ← Back to all jobs
        </Link>
      </main>
    )
  }

  const requirements = (job.requirements || '')
    .split(/\r?\n|\s-\s/)
    .map((item) => item.replace(/^-+\s*/, '').trim())
    .filter(Boolean)

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="logo">
          Job<span>Connect</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/#jobs">Find Jobs</Link>
          <Link to="/#about">About</Link>
        </div>

        <Link to="/#jobs" className="nav-button">
          Explore Jobs
        </Link>
      </nav>

      <main className="jobs-section details-page">
        <Link to="/#jobs" className="back-link">
          ← Back to all jobs
        </Link>

        <article className="job-card details-card">
          <div className="details-header">
            <div className="company-icon">
              {String(job.company_name || 'C')
                .charAt(0)
                .toUpperCase()}
            </div>

            <span className="job-type">
              {job.job_type || 'Job'}
            </span>
          </div>

          <h1>{job.title || 'Untitled Job'}</h1>

          <p className="company-name">
            {job.company_name || 'Company not specified'}
          </p>

          <div className="job-meta details-meta">
            <span>
              📍 {job.location || 'Location not specified'}
            </span>

            <span>
              💰 {job.salary || 'Salary not specified'}
            </span>
          </div>

          <div className="details-content">
            <h2>Job Description</h2>

            <p className="job-description">
              {job.description || 'No description available.'}
            </p>

            <h2>Requirements</h2>

            {requirements.length > 0 ? (
              <ul className="requirements">
                {requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No requirements specified.</p>
            )}
          </div>

          <button
            className="apply-button"
            type="button"
            onClick={() => navigate(`/apply?jobId=${job.id}`)}
          >
            Apply for this job →
          </button>
        </article>
      </main>

      <footer id="about">
        <Link to="/" className="logo footer-logo">
          Job<span>Connect</span>
        </Link>

        <p>Connecting talent with opportunity.</p>

        <p className="copyright">
          © 2026 JobConnect. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default JobDetails