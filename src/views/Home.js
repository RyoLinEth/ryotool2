import Footer from 'components/template/Footer'
import React from 'react'

const Home = () => {
	return (
		<div>
			<div style={{
				justifyContent: 'center',
				alignItems: 'center',
				display: 'flex',
				height: '70vh',
				wordBreak: 'break-word',
				textAlign: 'center'
			}}>
				<h1>
					Welcome to Ryo Tool
				</h1>
			</div>

			<Footer />
		</div>
	)
}

export default Home