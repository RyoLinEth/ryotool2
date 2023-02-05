import React from 'react'
import SignInForm from './SignInForm'

const SignIn = () => {
	return (
		<>
			<div className="mb-8">
				<h3 className="mb-1">Welcome back!</h3>
				<p>Please Connect Your Wallet to Login</p>
			</div>
			<SignInForm disableSubmit={false} />
		</>
	)
}

export default SignIn