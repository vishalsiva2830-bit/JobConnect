
import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom'
import JobDetails from './JobDetails'
import ApplicationForm from './ApplicationForm'
import './App.css'

function Home() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('')
  const [salaryRange, setSalaryRange] = useState('')
  const [sortBy, setSortBy] = useState('')

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch(
          'http://127.0.0.1:8000/api/jobs/'
        )

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`)
        }

        const data = await response.json()

        const jobList = Array.isArray(data)
          ? data
          : Array.isArray(data.results)
            ? data.results
            : []

        setJobs(jobList)
        setError('')
      } catch (err) {
        console.error('Jobs API error:', err)
        setError(
          'Unable to load jobs. Please check the Django backend.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const searchText = search.trim().toLowerCase()
    const locationText = location.trim().toLowerCase()

    const title = String(job.title || '').toLowerCase()
    const company = String(job.company_name || '').toLowerCase()
    const jobLocation = String(job.location || '').toLowerCase()
    const type = String(job.job_type || '').trim().toLowerCase()

    const matchesSearch =
      !searchText ||
      title.includes(searchText) ||
      company.includes(searchText)

    const matchesLocation =
      !locationText ||
      jobLocation.includes(locationText)

    const matchesJobType =
      !jobType ||
      type === jobType.trim().toLowerCase()

    // Read salary numbers from salary text
    const salaryText = String(job.salary || '')
    const salaryNumbers = salaryText.match(/\d[\d,]*/g) || []

    const salaries = salaryNumbers.map((value) =>
      Number(value.replace(/,/g, ''))
    )

    const minimumSalary = salaries.length
      ? Math.min(...salaries)
      : 0

    const maximumSalary = salaries.length
      ? Math.max(...salaries)
      : 0

    const matchesSalary =
      !salaryRange ||
      (salaryRange === '10-20' &&
        minimumSalary > 0 &&
        maximumSalary >= 10000 &&
        minimumSalary <= 20000) ||
      (salaryRange === '20-30' &&
        minimumSalary > 0 &&
        maximumSalary >= 20000 &&
        minimumSalary <= 30000) ||
      (salaryRange === '30+' &&
        maximumSalary >= 30000)

    return (
      matchesSearch &&
      matchesLocation &&
      matchesJobType &&
      matchesSalary
    )
  })

  // Sort filtered jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'salary') {
      const salaryA = Number(
        String(a.salary || '')
          .match(/\d[\d,]*/)?.[0]
          ?.replace(/,/g, '') || 0
      )

      const salaryB = Number(
        String(b.salary || '')
          .match(/\d[\d,]*/)?.[0]
          ?.replace(/,/g, '') || 0
      )

      return salaryB - salaryA
    }

    if (sortBy === 'latest') {
      const dateA = new Date(a.created_at || 0).getTime()
      const dateB = new Date(b.created_at || 0).getTime()

      return dateB - dateA
    }

    return 0
  })

  function handleSearch() {
    document.getElementById('jobs')?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  function clearSearch() {
    setSearch('')
    setLocation('')
    setJobType('')
    setSalaryRange('')
    setSortBy('')
  }

  return (
    <div className="app">
      <nav className="navbar">
        <a className="logo" href="#home">
          Job<span>Connect</span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#jobs">Find Jobs</a>
          <a href="#about">About</a>
        </div>

        <a className="nav-button" href="#jobs">
          Explore Jobs
        </a>
      </nav>

      <section className="hero" id="home">
        <div className="hero-content">
          <span className="eyebrow">
            YOUR CAREER STARTS HERE
          </span>

          <h1>
            Find a job that
            <br />
            <span>fits your future.</span>
          </h1>

          <p>
            Discover opportunities, explore careers, and take
            the next step towards your dream job.
          </p>

          <div className="search-box">
            <div className="search-field">
              <label htmlFor="job-search">
                Job title or company
              </label>

              <input
                id="job-search"
                type="text"
                placeholder="e.g. Python Developer"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <div className="search-field">
              <label htmlFor="location-search">
                Location
              </label>

              <input
                id="location-search"
                type="text"
                placeholder="e.g. Bangalore"
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
              />
            </div>

            <div className="search-field">
              <label htmlFor="job-type-filter">
                Job Type
              </label>

              <select
                id="job-type-filter"
                value={jobType}
                onChange={(event) =>
                  setJobType(event.target.value)
                }
              >
                <option value="">All Job Types</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="search-field">
              <label htmlFor="salary-filter">
                Salary Range
              </label>

              <select
                id="salary-filter"
                value={salaryRange}
                onChange={(event) =>
                  setSalaryRange(event.target.value)
                }
              >
                <option value="">All Salaries</option>
                <option value="10-20">
                  ₹10,000 – ₹20,000
                </option>
                <option value="20-30">
                  ₹20,000 – ₹30,000
                </option>
                <option value="30+">₹30,000+</option>
              </select>
            </div>

            <div className="search-field">
              <label htmlFor="sort-jobs">
                Sort Jobs
              </label>

              <select
                id="sort-jobs"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
              >
                <option value="">Default Order</option>
                <option value="latest">Latest Jobs</option>
                <option value="salary">
                  Salary: High to Low
                </option>
              </select>
            </div>

            <button
              className="search-button"
              type="button"
              onClick={handleSearch}
            >
              Search Jobs
            </button>
          </div>

          <p className="hero-note">
            Start exploring opportunities that match your skills.
          </p>
        </div>
      </section>

      <main className="jobs-section" id="jobs">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              CAREER OPPORTUNITIES
            </span>

            <h2>Explore available jobs</h2>

            <p>
              Find your next opportunity with JobConnect.
            </p>
          </div>

          <span className="job-count">
            {filteredJobs.length}{' '}
            {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Available
          </span>
        </div>

        {loading && (
          <p className="message">Loading jobs...</p>
        )}

        {!loading && error && (
          <div>
            <p className="message error">{error}</p>

            <button
              className="search-button"
              type="button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {sortedJobs.length > 0 ? (
              <div className="job-grid">
                {sortedJobs.map((job) => (
                  <article className="job-card" key={job.id}>
                    <div className="company-icon">
                      {String(job.company_name || 'C')
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <span className="job-type">
                      {job.job_type || 'Job'}
                    </span>

                    <h3>{job.title || 'Untitled Job'}</h3>

                    <p className="company-name">
                      {job.company_name ||
                        'Company not specified'}
                    </p>

                    <div className="job-meta">
                      <span>
                        📍 {job.location ||
                          'Location not specified'}
                      </span>

                      <span>
                        💰 {job.salary ||
                          'Salary not specified'}
                      </span>
                    </div>

                    <p className="job-description">
                      {job.description ||
                        'No description available.'}
                    </p>

                    <h4>Requirements</h4>

                    <ul className="requirements">
                      {(job.requirements || '')
                        .split(/\r?\n|\s-\s/)
                        .map((item) =>
                          item.replace(/^-+\s*/, '').trim()
                        )
                        .filter(Boolean)
                        .map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                    </ul>

                    <Link
                      to={`/jobs/${job.id}`}
                      className="apply-button"
                    >
                      View Details <span>→</span>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No matching jobs found</h3>

                <p>
                  Try changing your search, location, job type
                  or salary range.
                </p>

                <button
                  className="search-button"
                  type="button"
                  onClick={clearSearch}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer id="about">
        <a className="logo footer-logo" href="#home">
          Job<span>Connect</span>
        </a>

        <p>Connecting talent with opportunity.</p>

        <p className="copyright">
          © 2026 JobConnect. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/apply" element={<ApplicationForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
