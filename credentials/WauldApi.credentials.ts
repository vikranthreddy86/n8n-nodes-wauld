import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class WauldApi implements ICredentialType {
	name = 'wauldApi';

	displayName = 'Wauld API';

	icon: Icon = {
	light: 'file:../nodes/Wauld/wauld.svg',
	dark: 'file:../nodes/Wauld/wauld.dark.svg',
};

	documentationUrl = 'https://wauld.com';

	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'You can find your access token in Wauld under Integrations > n8n Integration. Click Generate Token, then copy and paste the token here.',
		},
		{
			displayName: 'Account ID',
			name: 'accountId',
			type: 'string',
			required: true,
			default: '',
			description: 'You can find your Wauld Account ID in the URL after wauld.com/. It starts with acc_. Copy and paste it here.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
				'Connect-Protocol-Version': '1',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://wauld.com',
			url: '/wauld.AccountService/GetAccount',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				id: '={{$credentials.accountId}}',
			},
		},
	};
}