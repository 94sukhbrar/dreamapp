import React from 'react';
import { Text, Linking } from 'react-native';
import Colors from '../Constants/Colors.js'

export default TermsAndConditions= () => (
	<>
		<Text style={{fontSize: 35, marginLeft: 4, color: Colors.grayTextColor, marginBottom: 5}}>Privacy Policy</Text>
		<Text style={{color: Colors.grayTextColor, fontSize: 16, marginLeft: 10}}>
			We built the Dream app as a Commercial app. This SERVICE is provided by Deam Shop LTD and is intended for use as is.{'\n'}
			This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.{'\n'}
			If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.{'\n'}
			The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at the Dream app.{'\n'}
			<Text style={{fontSize: 25,}}>Information Collection and Use</Text>{'\n'}
			For a better experience, while using our Service, We may require you to provide us with certain personally identifiable information. The information that we request will be saved on our database and will not be accessible to any one or any entity except for the following information.{'\n'}
			<Text style={{color: Colors.textColor, fontSize: 18, fontWeight: 'bold'}}>.</Text>  Full name{'\n'}
			<Text style={{color: Colors.textColor, fontSize: 18, fontWeight: 'bold'}}>.</Text>  Profile picture{'\n'}
			The app does use a third party service called stripe that will collect your payment information upon scheduling an appointment.{'\n'}
			Link to stripe's privacy policy{'\n'}
			<Text style={{color: Colors.tintColor,}} onPress={() => Linking.openURL('https://stripe.com/privacy')}><Text style={{color: Colors.textColor, fontSize: 18, fontWeight: 'bold'}}>.</Text>  Stripe{'\n'}</Text>
			<Text style={{fontSize: 25,}}>Log Data</Text>{'\n'}
			We want to inform you that whenever you use our Service, in a case of an error in the app we collect data and information (through third party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.{'\n'}
			<Text style={{fontSize: 25,}}>Service Providers</Text>{'\n'}
			we may employ third-party companies and individuals due to the following reasons:{'\n'}
			
			<Text style={{color: Colors.textColor, fontSize: 18, fontWeight: 'bold'}}>.</Text>  To facilitate our Service;{'\n'}
			<Text style={{color: Colors.textColor, fontSize: 18, fontWeight: 'bold'}}>.</Text>  To provide the Service on our behalf;{'\n'}
			<Text style={{color: Colors.textColor, fontSize: 18, fontWeight: 'bold'}}>.</Text>  To perform Service-related services; or{'\n'}
			<Text style={{color: Colors.textColor, fontSize: 18, fontWeight: 'bold'}}>.</Text>  To assist us in analyzing how our Service is used.{'\n'}
			we want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.{'\n'}
			<Text style={{fontSize: 25,}}>Security</Text>{'\n'}
			we value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.{'\n'}
			<Text style={{fontSize: 25,}}>Links to Other Sites</Text>{'\n'}
			This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. we have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.{'\n'}
			<Text style={{fontSize: 25,}}>Children’s Privacy</Text>{'\n'}
			These Services do not address anyone under the age of 13. we do not knowingly collect personally identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.{'\n'}
			<Text style={{fontSize: 25,}}>Changes to This Privacy Policy</Text>{'\n'}
			we may update our Privacy Policy from time to time. Thus, you are advised to review <Text style={{color: Colors.tintColor}} onPress={() => Linking.openURL('https://dream-1.flycricket.io/privacy.html')}>this page</Text> periodically for any changes. we will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page.{'\n'}
			<Text style={{fontSize: 25,}}>Contact Us</Text>{'\n'}
			If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at dreamconsultationsapp@gmail.com.{'\n'}
		</Text>
	</>
);