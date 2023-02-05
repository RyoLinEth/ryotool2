import React from 'react'
import { Input, Button, Checkbox, FormItem, FormContainer, Alert } from 'components/ui'
import { PasswordInput, ActionLink } from 'components/shared'
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from 'utils/hooks/useAuth'

const validationSchema = Yup.object().shape({
	userName: Yup.string().required('Please enter your user name'),
	password: Yup.string().required('Please enter your password'),
	rememberMe: Yup.bool()
})

const SignInForm = props => {
	console.log(props)
	const { 
		disableSubmit = false, 
		className, 
	} = props

	const [message, setMessage] = useTimeOutMessage()

	const { signIn } = useAuth()

	const onSignIn = async (values, setSubmitting) => {
		const { userName, password } = values
		setSubmitting(true)
		
		const result = await signIn({ userName, password })

		if (result.status === 'failed') {
			setMessage(result.message)
		}

		setSubmitting(false)
	}

	return (
		<div className={className}>
			{message && <Alert className="mb-4" type="danger" showIcon>{message}</Alert>}
			<Formik
				// Remove this initial value
				initialValues={{
					userName: 'admin', 
					password: '123Qwe', 
					rememberMe: true 
				}}
				validationSchema={validationSchema}
				onSubmit={(values, { setSubmitting }) => {
					if(!disableSubmit) {
						onSignIn(values, setSubmitting)
					} else {
						setSubmitting(false)
					}
				}}
			>
				{({isSubmitting}) => (
					<Form>
						<FormContainer>
							
							<Button block loading={isSubmitting} variant="solid" type="submit">
								{ isSubmitting ? 'Signing in...' : 'Sign In' }
							</Button>
							
						</FormContainer>
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default SignInForm