import * as Yup from 'yup'

export const loginSchema = t => Yup.object({
  username: Yup.string()
    .min(3, t('auth.validation.usernameLength'))
    .max(20, t('auth.validation.usernameLength'))
    .required(t('auth.validation.required')),
  password: Yup.string()
    .required(t('auth.validation.required')),
})

export const signupSchema = t => Yup.object({
  username: Yup.string()
    .min(3, t('auth.validation.usernameLength'))
    .max(20, t('auth.validation.usernameLength'))
    .required(t('auth.validation.required')),
  password: Yup.string()
    .min(6, t('auth.validation.passwordMin'))
    .required(t('auth.validation.required')),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], t('auth.validation.passwordsMatch'))
    .required(t('auth.validation.required')),
})

export const channelSchema = (t, channels, currentChannelId = null, currentName = null) => Yup.object({
  name: Yup.string()
    .min(3, t('chat.channels.addModal.lengthError'))
    .max(20, t('chat.channels.addModal.lengthError'))
    .test('unique', t('chat.channels.addModal.uniqueError'), (value) => {
      if (currentName && value === currentName) return true
      return !channels.some(channel =>
        (currentChannelId ? channel.id !== currentChannelId : true)
        && channel.name.toLowerCase() === value.toLowerCase(),
      )
    })
    .required(t('auth.validation.required')),
})
