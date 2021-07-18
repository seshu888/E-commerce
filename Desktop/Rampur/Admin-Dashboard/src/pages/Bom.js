import React from 'react';
import Layout from 'layout/Layout';
import firebaseIn from '../configs/firebase'
import firebase from 'firebase'





export default function Bom(props){

		return (
			<Layout history={props.history}>
				<div style={{padding:'50px' ,margin:'10px'}}>
					<p>Bom configuration</p>

				
				</div>
			</Layout>
		);
	
}

