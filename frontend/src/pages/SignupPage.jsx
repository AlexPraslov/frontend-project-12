import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SignupPage = () => {
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, t('auth.validation.usernameLength'))
      .max(20, t('auth.validation.usernameLength'))
      .required(t('auth.validation.required')),
    password: Yup.string()
      .min(6, t('auth.validation.passwordMin', { count: 6 }))
      .required(t('auth.validation.required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('auth.validation.passwordsMatch'))
      .required(t('auth.validation.required')),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setSubmitting(true);
    setServerError('');

    try {
      // Отправляем запрос на регистрацию
      await axios.post('/api/v1/signup', {
        username: values.username,
        password: values.password,
      });

      // После успешной регистрации редирект на главную
      navigate('/');
      
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      
      if (error.response?.status === 409) {
        setServerError(t('auth.signup.userExists'));
      } else {
        setServerError(error.response?.data?.message || t('auth.signup.registrationError'));
      }
      
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e0e0e0'
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#333',
          fontSize: '28px',
          fontWeight: '600'
        }}>
          {t('auth.signup.title')}
        </h1>
        
        <Formik
          initialValues={{ username: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              {serverError && (
                <div style={{ 
                  color: '#dc3545', 
                  marginBottom: '20px',
                  padding: '12px',
                  backgroundColor: '#f8d7da',
                  borderRadius: '6px',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  {serverError}
                </div>
              )}

              {/* Имя пользователя */}
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="username" style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px'
                }}>
                  {t('auth.signup.username')}:
                </label>
                <Field 
                  id="username" 
                  name="username" 
                  type="text"
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: `1px solid ${touched.username && errors.username ? '#dc3545' : '#ddd'}`,
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                />
                <ErrorMessage name="username">
                  {msg => (
                    <div style={{ 
                      color: '#dc3545', 
                      fontSize: '13px', 
                      marginTop: '5px' 
                    }}>
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
              </div>

              {/* Пароль */}
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="password" style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px'
                }}>
                  {t('auth.signup.password')}:
                </label>
                <Field 
                  id="password" 
                  name="password" 
                  type="password"
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: `1px solid ${touched.password && errors.password ? '#dc3545' : '#ddd'}`,
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                />
                <ErrorMessage name="password">
                  {msg => (
                    <div style={{ 
                      color: '#dc3545', 
                      fontSize: '13px', 
                      marginTop: '5px' 
                    }}>
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
                <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '5px' }}>
                  {t('auth.signup.minPassword')}
                </div>
              </div>

              {/* Подтверждение пароля */}
              <div style={{ marginBottom: '25px' }}>
                <label htmlFor="confirmPassword" style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px'
                }}>
                  {t('auth.signup.confirmPassword')}:
                </label>
                <Field 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password"
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: `1px solid ${touched.confirmPassword && errors.confirmPassword ? '#dc3545' : '#ddd'}`,
                    borderRadius: '6px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                />
                <ErrorMessage name="confirmPassword">
                  {msg => (
                    <div style={{ 
                      color: '#dc3545', 
                      fontSize: '13px', 
                      marginTop: '5px' 
                    }}>
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
              </div>

              <button 
                type="submit" 
                disabled={submitting || isSubmitting}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: submitting || isSubmitting ? '#6c757d' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: (submitting || isSubmitting) ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                  marginBottom: '20px'
                }}
              >
                {submitting || isSubmitting ? t('auth.signup.loading') : t('auth.signup.submit')}
              </button>
            </Form>
          )}
        </Formik>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #eee',
          fontSize: '14px',
          color: '#666'
        }}>
          <p style={{ margin: '0 0 10px 0' }}>
            {t('auth.signup.hasAccount')}
          </p>
          <p style={{ margin: '0' }}>
            <Link to="/login" style={{
              color: '#007bff',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              {t('auth.signup.loginLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
