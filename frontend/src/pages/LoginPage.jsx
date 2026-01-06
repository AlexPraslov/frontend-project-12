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
    <div>
      <h1>Авторизация</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            {errors.submit && (
              <div style={{ color: 'red', marginBottom: '15px' }}>
                {errors.submit}
              </div>
            )}

            <div>
              <label htmlFor="username">Имя пользователя:</label>
              <Field id="username" name="username" type="text" />
              <ErrorMessage name="username" component="div" />
            </div>

            <div>
              <label htmlFor="password">Пароль:</label>
              <Field id="password" name="password" type="password" />
              <ErrorMessage name="password" component="div" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Вход...' : 'Войти'}
            </button>
          </Form>
        )}
      </Formik>
      <p>
        <Link to="/">На главную</Link>
      </p>
    </div>
  );
};

export default LoginPage;
