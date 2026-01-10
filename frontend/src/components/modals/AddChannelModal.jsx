import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addChannel } from '../../store/slices/channelsSlice';
import { useTranslation } from 'react-i18next';
import { hasProfanity } from '../../utils/profanityFilter';

const AddChannelModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const channels = useSelector((state) => state.channels.items);
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('chat.channels.addModal.lengthError'))
      .max(20, t('chat.channels.addModal.lengthError'))
      .test('unique', t('chat.channels.addModal.uniqueError'), (value) => {
        return !channels.some(channel => 
          channel.name.toLowerCase() === value.toLowerCase()
        );
      })
      .test('profanity', t('chat.channels.addModal.profanityError'), (value) => {
        // Проверяем на нецензурные слова
        return !hasProfanity(value);
      })
      .required(t('auth.validation.required')),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setSubmitting(true);
    try {
      await dispatch(addChannel(values.name)).unwrap();
      resetForm();
      onHide();
    } catch (error) {
      console.error('Ошибка при создании канала:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

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
            {t('chat.channels.addModal.title')}
          </h3>
        </div>

        {/* Форма */}
        <Formik
          initialValues={{ name: '' }}
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
                    {t('chat.channels.addModal.name')}
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
                    lineHeight: '1.4',
                  }}>
                    {t('chat.channels.addModal.hint')}
                  </div>
                </div>
              </div>

              {/* Кнопки */}
              <div style={{
                padding: '16px 24px',
                backgroundColor: '#f8f9fa',
                borderTop: '1px solid #e9ecef',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
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
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                >
                  {t('chat.channels.addModal.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={!isValid || !dirty || submitting}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: isValid && dirty && !submitting ? '#28a745' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: isValid && dirty && !submitting ? 'pointer' : 'not-allowed',
                    transition: 'background-color 0.2s',
                    minWidth: '80px',
                  }}
                >
                  {submitting ? t('chat.channels.addModal.loading') : t('chat.channels.addModal.submit')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddChannelModal;
