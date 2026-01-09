import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renameChannel } from '../../store/slices/channelsSlice';

const RenameChannelModal = ({ show, onHide, channelId }) => {
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const channels = useSelector((state) => state.channels.items);
  
  const channel = channels.find(ch => ch.id === channelId);
  
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Должно быть от 3 до 20 символов')
      .max(20, 'Должно быть от 3 до 20 символов')
      .test('unique', 'Канал с таким именем уже существует', (value) => {
        return !channels.some(ch => 
          ch.id !== channelId && ch.name.toLowerCase() === value.toLowerCase()
        );
      })
      .required('Обязательное поле'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    if (!channel) return;
    
    setSubmitting(true);
    try {
      await dispatch(renameChannel({ channelId, name: values.name })).unwrap();
      resetForm();
      onHide();
    } catch (error) {
      console.error('Ошибка при переименовании канала:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!show || !channel) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
      }}>
        {/* Заголовок */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e9ecef',
          backgroundColor: '#f8f9fa',
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: '#212529',
          }}>
            Переименовать канал
          </h3>
        </div>

        {/* Форма */}
        <Formik
          initialValues={{ name: channel.name }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid, dirty, handleSubmit, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <label 
                    htmlFor="channelName" 
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#495057',
                    }}
                  >
                    Новое имя канала
                  </label>
                  <Field
                    type="text"
                    name="name"
                    id="channelName"
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #ced4da',
                      borderRadius: '6px',
                      fontSize: '14px',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#80bdff';
                      e.target.style.boxShadow = '0 0 0 0.2rem rgba(0, 123, 255, 0.25)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ced4da';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  
                  {/* Подсказка при валидации */}
                  {touched.name && errors.name && (
                    <div style={{
                      color: '#dc3545',
                      fontSize: '13px',
                      marginTop: '8px',
                      padding: '8px 12px',
                      backgroundColor: '#f8d7da',
                      borderRadius: '4px',
                      border: '1px solid #f5c6cb',
                    }}>
                      {errors.name}
                    </div>
                  )}
                  
                  {/* Общая подсказка о требованиях */}
                  <div style={{
                    fontSize: '12px',
                    color: '#6c757d',
                    marginTop: '8px',
                    padding: '4px 0',
                  }}>
                    Имя канала должно быть от 3 до 20 символов и быть уникальным
                  </div>
                </div>
              </div>

              {/* Кнопки */}
              <div style={{
                padding: '16px 24px',
                borderTop: '1px solid #e9ecef',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
              }}>
                <button
                  type="button"
                  onClick={onHide}
                  disabled={submitting}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    opacity: submitting ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) {
                      e.currentTarget.style.backgroundColor = '#5a6268';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!submitting) {
                      e.currentTarget.style.backgroundColor = '#6c757d';
                    }
                  }}
                >
                  Отменить
                </button>
                <button
                  type="submit"
                  disabled={!isValid || !dirty || submitting}
                  style={{
                    padding: '8px 20px',
                    backgroundColor: submitting ? '#6c757d' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: (!isValid || !dirty || submitting) ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    opacity: (!isValid || !dirty) ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (isValid && dirty && !submitting) {
                      e.currentTarget.style.backgroundColor = '#0069d9';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isValid && dirty && !submitting) {
                      e.currentTarget.style.backgroundColor = '#007bff';
                    }
                  }}
                >
                  {submitting ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RenameChannelModal;
