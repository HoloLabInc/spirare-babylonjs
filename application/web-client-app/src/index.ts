import i18next from 'i18next'
import i18nextHttpBackend from 'i18next-http-backend'
import i18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'

i18next
  .use(i18nextBrowserLanguageDetector)
  .use(i18nextHttpBackend)
  .init(
    {
      fallbackLng: 'en',
      backend: {
        loadPath: '/locales/{{lng}}/translation.json',
      },
    },
    function (err, t) {
      updateContent()
    }
  )

function updateContent() {
  const idList = [
    'title-geo-placement',
    'title-space-placement',
    'button-geo-placement-edit-mode',
    'button-geo-placement-view-mode',
    'button-space-placement-edit-mode',
    'button-space-placement-view-mode',
  ]
  idList.forEach((id) => {
    document.getElementById(id)!.innerHTML = i18next.t(id)
  })

  document.getElementById('container')!.classList.remove('hidden')
}

function changeLanguage(lang: string) {
  i18next.changeLanguage(lang, () => {
    updateContent()
  })
}
