import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import './App.css'

function ApplicationForm() {
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get('jobId')

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    cover_letter: '',
  })

  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!jobId) {
      setError(true)
      setMessage('Job ID missing. Please open a job and click Apply again.')
      return
    }

    if (!resume) {
      setError(true)
      setMessage('Please upload your resume.')
      return
    }

    const data = new FormData()
    data.append('job', jobId)
    data.append('full_name', formData.full_name.trim())
    data.append('email', formData.email.trim())
    data.append('phone', formData.phone.trim())
    data.append('cover_letter', formData.cover_letter.trim())
    data.append('resume', resume)

    setLoading(true)
    setMessage('')
    setError(false)

    try {
      const response = await fetch(
        'https://jobconnect-backend-m20c.onrender.com/api/applications/',
        {
          method: 'POST',
          body: data,
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          Object.values(result).flat().join(' ') ||
          'Unable to submit application.'
        )
      }

      setMessage('Application submitted successfully!')
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        cover_letter: '',
      })
      setResume(null)
      e.target.reset()
    } catch (err) {
      setError(true)
      setMessage(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

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
      </nav>

      <main className="jobs-section application-page">
        <Link to="/#jobs" className="back-link">
          ← Back to Jobs
        </Link>

        <section className="application-card">
          <div className="application-heading">
            <span className="eyebrow">TAKE THE NEXT STEP</span>
            <h1>Job Application</h1>
            <p>
              Complete the form below to submit your application.
              Make sure your contact details are correct.
            </p>
          </div>

          {message && (
            <div
              className={`application-message ${
                error ? 'application-error' : 'application-success'
              }`}
              role="status"
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="application-form">
            <div className="application-field">
              <label htmlFor="full_name">Full Name *</label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />
            </div>

            <div className="application-field">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="application-field">
              <label htmlFor="phone">Phone Number *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                autoComplete="tel"
                required
              />
            </div>

            <div className="application-field">
              <label htmlFor="resume">Upload Resume (PDF/DOC/DOCX) *</label>
              <input
                id="resume"
                name="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files?.[0] || null)}
                required
              />
              <small>Choose your latest resume from your device.</small>
            </div>

            <div className="application-field">
              <label htmlFor="cover_letter">Cover Letter</label>
              <textarea
                id="cover_letter"
                name="cover_letter"
                value={formData.cover_letter}
                onChange={handleChange}
                placeholder="Tell the employer why you are interested in this role."
                rows={5}
              />
            </div>

            <button
              type="submit"
              className="apply-button application-submit"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Application →'}
            </button>

            <p className="form-note">
              Your application will be submitted for review.
            </p>
          </form>
        </section>
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

export default ApplicationForm