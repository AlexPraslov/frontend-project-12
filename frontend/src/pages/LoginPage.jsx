import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { loginSchema } from '../utils/validationSchemas'

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const initialValues = {
    username: '',
    password: '',
  }

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const result = await login(values.username, values.password)

    if (result.success) {
      // Редирект произойдет автоматически через useEffect
    }
    else {
      setErrors({ submit: t('auth.validation.authError') })
    }

    setSubmitting(false)
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="bg-white p-4 rounded shadow-sm border">
          <h1 className="text-center mb-4 text-dark fs-3 fw-semibold">
            {t('auth.login.title')}
          </h1>

          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema(t)}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                {errors.submit && (
                  <div className="text-danger mb-3 p-2 bg-danger-subtle rounded text-center">
                    {errors.submit}
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="username" className="form-label fw-medium text-secondary">
                    {t('auth.login.username')}
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

                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-medium text-secondary">
                    {t('auth.login.password')}
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-100 py-2 fw-semibold"
                >
                  {isSubmitting ? t('auth.login.loading') : t('auth.login.submit')}
                </button>
              </Form>
            )}
          </Formik>

          <div className="text-center mt-4 pt-3 border-top text-secondary">
            <p className="mb-2">
              {t('auth.login.noAccount')}
            </p>
            <p className="mb-0">
              <Link
                to="/signup"
                className="text-success text-decoration-none fw-medium"
              >
                {t('auth.login.signupLink')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
