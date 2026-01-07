import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const initialValues = {
    username: 'admin',
    password: 'admin',
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Имя пользователя должно быть не менее 3 символов')
      .max(20, 'Имя пользователя должно быть не более 20 символов')
      .required('Обязательное поле'),
    password: Yup.string()
      .min(3, 'Пароль должен быть не менее 3 символов')
      .required('Обязательное поле'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const result = await login(values.username, values.password);

    if (result.success) {
      // Редирект произойдет автоматически через useEffect
    } else {
      setErrors({ submit: result.message });
    }

    setSubmitting(false);
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
          Вход в Hexlet Chat
        </h1>
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              {errors.submit && (
                <div style={{ 
                  color: '#dc3545', 
                  marginBottom: '20px',
                  padding: '12px',
                  backgroundColor: '#f8d7da',
                  borderRadius: '6px',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  {errors.submit}
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="username" style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px'
                }}>
                  Имя пользователя:
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

              <div style={{ marginBottom: '25px' }}>
                <label htmlFor="password" style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px'
                }}>
                  Пароль:
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
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: isSubmitting ? '#6c757d' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                  marginBottom: '20px'
                }}
              >
                {isSubmitting ? 'Вход...' : 'Войти'}
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
            Используйте для входа:
          </p>
          <p style={{ 
            margin: '0',
            backgroundColor: '#f8f9fa',
            padding: '8px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '13px'
          }}>
            Логин: admin | Пароль: admin
          </p>
          <p style={{ margin: '20px 0 0 0' }}>
            <Link to="/" style={{
              color: '#007bff',
              textDecoration: 'none'
            }}>
              Вернуться на главную
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
