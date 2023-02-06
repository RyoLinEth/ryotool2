import { useSelector } from 'react-redux'

function useLocale() {

    const locale = useSelector((state) => state.theme.locale)

    return locale
}

export default useLocale