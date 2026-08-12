import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCredentialIssue = {
	operation: ['issue'],
	resource: ['credential'],
};

export const credentialIssueDescription: INodeProperties[] = [
	{
		displayName: 'Workspace',
		name: 'workspace',
		type: 'options',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyForCredentialIssue,
		},
		description: 'Select the Wauld workspace',
		typeOptions: {
			loadOptions: {
				routing: {
					request: {
						method: 'POST',
						url: '/wauld.WorkspaceService/ListWorkspaces',
						body: {
							parent: '={{$credentials.accountId}}',
							pageSize: 25,
						},
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'workspaces',
								},
							},
							{
								type: 'setKeyValue',
								properties: {
									name: '={{$responseItem.name}}',
									value: '={{$responseItem.id}}',
								},
							},
							{
								type: 'sort',
								properties: {
									key: 'name',
								},
							},
						],
					},
				},
			},
		},
	},
	{
		displayName: 'Engagement',
		name: 'engagement',
		type: 'options',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyForCredentialIssue,
		},
		description: 'Select the Wauld engagement',
		typeOptions: {
			loadOptionsDependsOn: ['workspace'],
			loadOptions: {
				routing: {
					request: {
						method: 'POST',
						url: '/wauld.EngagementService/ListEngagements',
						body: {
							parent: '={{$parameter.workspace}}',
							pageSize: 10,
						},
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'engagements',
								},
							},
							{
								type: 'setKeyValue',
								properties: {
									name: '={{$responseItem.name}}',
									value: '={{$responseItem.id}}',
								},
							},
							{
								type: 'sort',
								properties: {
									key: 'name',
								},
							},
						],
					},
				},
			},
		},
	},
	{
		displayName: 'Document',
		name: 'document',
		type: 'options',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyForCredentialIssue,
		},
		description: 'Select the Wauld document to issue',
		typeOptions: {
			loadOptionsDependsOn: ['engagement'],
			loadOptions: {
				routing: {
					request: {
						method: 'POST',
						url: '/wauld.DocumentService/ListDocuments',
						body: {
							parent: '={{$parameter.engagement}}',
							pageSize: 10,
						},
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'documents',
								},
							},
							{
								type: 'setKeyValue',
								properties: {
									name: '={{$responseItem.name}}',
									value: '={{$responseItem.id}}',
								},
							},
							{
								type: 'sort',
								properties: {
									key: 'name',
								},
							},
						],
					},
				},
			},
		},
	},
	{
		displayName: 'Recipient Name',
		name: 'recipientName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyForCredentialIssue,
		},
		placeholder: 'e.g. John Smith',
		description: 'Name of the credential recipient',
	},
	{
		displayName: 'Recipient Email',
		name: 'recipientEmail',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyForCredentialIssue,
		},
		placeholder: 'e.g. john@example.com',
		description: 'Email address of the credential recipient',
	},
	{
		displayName: 'Sharable',
		name: 'sharable',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: showOnlyForCredentialIssue,
		},
		description: 'Whether the credential can be shared',
	},
	{
		displayName: 'LinkedIn',
		name: 'linkedIn',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: showOnlyForCredentialIssue,
		},
		description: 'Whether LinkedIn sharing is enabled for the credential',
	},
];