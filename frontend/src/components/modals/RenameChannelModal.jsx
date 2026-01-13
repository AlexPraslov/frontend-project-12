import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { renameChannel } from '../../store/slices/channelsSlice'
import { filterProfanity } from '../../utils/profanityFilter'
import { useTranslation } from 'react-i18next'
import { Modal, Button, Form as BSForm } from 'react-bootstrap'

const RenameChannelModal = ({ show, onHide, channelId }) => {
  const dispatch = useDispatch()
  const [submitting, setSubmitting] = useState(false)
  const channels = useSelector(state => state.channels.items)
  const { t } = useTranslation()

  const channel = channels.find(ch => ch.id === channelId)

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('chat.channels.addModal.lengthError'))
      .max(20, t('chat.channels.addModal.lengthError'))
      .test('unique', t('chat.channels.addModal.uniqueError'), (value) => {
        if (value === channel?.name) return true
        return !channels.some(ch => ch.id !== channelId && ch.name.toLowerCase() === value.toLowerCase())
      })
      .required(t('auth.validation.required')),
  })

  const handleSubmit = async (values, { resetForm }) => {
    if (!channel) return

    setSubmitting(true)
    try {
      const filteredName = filterProfanity(values.name)
      await dispatch(renameChannel({ channelId, name: filteredName })).unwrap()
      resetForm()
      onHide()
    }
    catch (error) {
      console.error('Ошибка при переименовании канала:', error)
    }
    finally {
      setSubmitting(false)
    }
  }

  if (!show || !channel) return null

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('chat.channels.renameModal.title')}</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={{ name: channel.name }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ handleSubmit: formikSubmit, submitForm }) => (
          <Form onSubmit={formikSubmit}>
            <Modal.Body>
              <BSForm.Group>
                <BSForm.Label htmlFor="renameChannelNameInput">
                  {t('chat.channels.renameModal.name')}
                </BSForm.Label>
                <Field name="name">
                  {({ field, meta }) => (
                    <>
                      <BSForm.Control
                        {...field}
                        id="renameChannelNameInput"
                        type="text"
                        autoFocus
                        isInvalid={meta.touched && meta.error}
                        placeholder={t('chat.channels.renameModal.name')}
                        aria-label="Имя канала"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            submitForm()
                          }
                        }}
                      />
                      {meta.touched && meta.error && (
                        <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
                          {meta.error}
                        </div>
                      )}
                    </>
                  )}
                </Field>
              </BSForm.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={onHide}
                disabled={submitting}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        {t('chat.channels.renameModal.loading')}
                      </>
                    )
                  : t('chat.channels.renameModal.submit')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default RenameChannelModal
