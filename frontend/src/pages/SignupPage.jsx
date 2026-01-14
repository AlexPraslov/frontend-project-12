import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { signupSchema } from '../utils/validationSchemas'

const SignupPage = () => {
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { signup } = useAuth()
  const { t } = useTranslation()

  const handleSubmit = async (values, { resetForm }) => {
    setSubmitting(true)
    setServerError('')

    try {
      const result = await signup(values.username, values.password)

      if (result.success) {
        navigate('/')
      }
      else {
        setServerError(result.message || t('auth.signup.registrationError'))
        resetForm()
      }
    }
    catch (error) {
      console.error('Ошибка регистрации:', error)
      setServerError(t('auth.signup.registrationError'))
      resetForm()
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="bg-white p-4 rounded shadow-sm border">
          <h1 className="text-center mb-4 text-dark fs-3 fw-semibold">
            {t('auth.signup.title')}
          </h1>

          <Formik
            initialValues={{ username: '', password: '', confirmPassword: '' }}
            validationSchema={signupSchema(t)}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                {serverError && (
                  <div className="text-danger mb-3 p-2 bg-danger-subtle rounded text-center">
                    {serverError}
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="username" className="form-label fw-medium text-secondary">
                    {t('auth.signup.username')}
                    :
                  </label>
                  <Field
                    id="username"
                    name="username"
                    type="text"
                    className={`form-control ${touched.username && errors.username ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage name="username">
                    {msg => (
                      <div className="invalid-feedback d-block">
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-medium text-secondary">
                    {t('auth.signup.password')}
                    :
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage name="password">
                    {msg => (
                      <div className="invalid-feedback d-block">
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label fw-medium text-secondary">
                    {t('auth.signup.confirmPassword')}
                    :
                  </label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className={`form-control ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage name="confirmPassword">
                    {msg => (
                      <div className="invalid-feedback d-block">
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                <button
                  type="submit"
                  disabled={submitting || isSubmitting}
                  className="btn btn-success w-100 py-2 fw-semibold"
                >
                  {submitting || isSubmitting ? t('auth.signup.loading') : t('auth.signup.submit')}
                </button>
              </Form>
            )}
          </Formik>

          <div className="text-center mt-4 pt-3 border-top text-secondary">
            <p className="mb-2">
              {t('auth.signup.hasAccount')}
            </p>
            <p className="mb-0">
              <Link
                to="/login"
                className="text-primary text-decoration-none fw-medium"
              >
                {t('auth.signup.loginLink')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
