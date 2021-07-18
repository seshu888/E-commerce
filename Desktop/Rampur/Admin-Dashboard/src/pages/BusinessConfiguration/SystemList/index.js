import React, { useState } from 'react';
import 'date-fns';

import Layout from 'layout/Layout';
import Tags from './Tags';
import PaymentTerms from './PaymentTerms';
import TaxCodes from './TaxCodes';
import CustomerType from './CustomerType';

export default function SystemList(props) {
	const [ selectedTab, setSelectedTab ] = useState(null);

	const handleTabChange = (tab) => {
		setSelectedTab(tab);
	};

	return (
		<Layout history={props.history}>
			<div className="p-24">
				<div className="container p-0">
					<div className="pb-32">
						<p className="pageHeader">System Data</p>
					</div>
					<div className="row m-0">
						<div className="col-md-2">
							<p
								className="sectionContent pb-4 textHover text-blue"
								onClick={() => handleTabChange('tags')}
								style={{ color: selectedTab === 'tags' ? 'black' : '' }}
							>
								Tags
							</p>
							<p
								className="sectionContent pb-4 textHover text-blue"
								onClick={() => handleTabChange('paymentTerms')}
								style={{ color: selectedTab === 'paymentTerms' ? 'black' : '' }}
							>
								Payment Terms
							</p>
							<p
								className="sectionContent pb-4 textHover text-blue"
								onClick={() => handleTabChange('taxCodes')}
								style={{ color: selectedTab === 'taxCodes' ? 'black' : '' }}
							>
								Tax Codes
							</p>
				            <p
                                className="sectionContent pb-4 textHover text-blue"
                                onClick={() => handleTabChange('CustomerType')}
                                style={{ color: selectedTab === 'CustomerType' ? 'black' : '' }}
                            >
                                Customer Type
                            </p>

						</div>
						<div className="col-md-10">
							{selectedTab === 'tags' && <Tags />}
							{selectedTab === 'paymentTerms' && <PaymentTerms />}
							{selectedTab === 'taxCodes' && <TaxCodes />}
							{selectedTab === 'CustomerType' && <CustomerType />}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}
