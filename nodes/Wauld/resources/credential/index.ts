import type { INodeProperties } from 'n8n-workflow';
import { credentialIssueDescription } from './issue';

const showOnlyForCredentials = {
	resource: ['credential'],
};

export const credentialDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForCredentials,
		},
		options: [
			{
				name: 'Issue',
				value: 'issue',
				action: 'Issue a credential',
				description: 'Issue a credential to a recipient',
				routing: {
					request: {
						method: 'POST',
						url: '/wauld.CredentialService/PublishAdhocCredential',
						body: {
							parent: '={{$parameter.document}}',
							recipient: {
								name: '={{$parameter.recipientName}}',
								email: '={{$parameter.recipientEmail}}',
							},
							attributes:
								'={{$parameter.attributes.attributeValues || []}}',
							expireTime:
								'={{$parameter.expireTime ? $parameter.expireTime + "Z" : undefined}}',
							sharable: '={{$parameter.sharable}}',
							linkedIn: '={{$parameter.linkedIn}}',
						},
					},
				},
			},
		],
		default: 'issue',
	},
	...credentialIssueDescription,
];