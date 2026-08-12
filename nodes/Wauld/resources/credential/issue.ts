import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCredentialIssue = {
	operation: ['issue'],
	resource: ['credential'],
};

export const credentialIssueDescription: INodeProperties[] = [
	{
		displayName: 'Workspace Name or ID',
		name: 'workspace',
		type: 'options',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyForCredentialIssue,
		},
		description:
			'Choose from the list, or specify an ID using an expression',
		hint: 'Choose the Wauld workspace where the document to be issued is located.',
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
		displayName: 'Engagement Name or ID',
		name: 'engagement',
		type: 'options',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyForCredentialIssue,
		},
		description:
			'Choose from the list, or specify an ID using an expression',
		hint: 'Choose the engagement that contains the document to be issued.',
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
		displayName: 'Document Name or ID',
		name: 'document',
		type: 'options',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyForCredentialIssue,
		},
		description:
			'Choose from the list, or specify an ID using an expression',
		hint: 'Choose the document to issue as a credential.',
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
		description:
			'Enter the full name of the recipient who will receive the credential',
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
		description:
			"Enter the recipient's email address. Wauld will send the issued credential to this address.",
	},
	{
		displayName: 'Custom Attributes',
		name: 'attributes',
		type: 'fixedCollection',
		placeholder: 'Add Custom Attribute',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: showOnlyForCredentialIssue,
		},
		description:
			'Map any custom attributes required by the selected document. These are recipient-specific values.',
		options: [
			{
				displayName: 'Custom Attribute',
				name: 'attributeValues',
				values: [
					{
						displayName: 'Attribute Name',
						name: 'name',
						type: 'options',
						default: '',
						description:
							'Choose a custom attribute from the selected document',
						typeOptions: {
							loadOptionsDependsOn: ['document'],
							loadOptions: {
								routing: {
									request: {
										method: 'POST',
										url: '/wauld.DocumentService/GetDocument',
										body: {
											id: '={{$parameter.document}}',
										},
									},
									output: {
										postReceive: [
											{
												type: 'rootProperty',
												properties: {
													property: 'customAttributes',
												},
											},
											{
												type: 'setKeyValue',
												properties: {
													name: '={{$responseItem}}',
													value: '={{$responseItem}}',
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
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description:
							'Enter the recipient-specific value for this custom attribute',
					},
				],
			},
		],
	},
	{
		displayName: 'Expiry Date',
		name: 'expireTime',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: showOnlyForCredentialIssue,
		},
		description:
			'Enter the expiry date for the credential. Leave this field blank if the credential should not expire.',
	},
	{
		displayName: 'Shareable',
		name: 'sharable',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: showOnlyForCredentialIssue,
		},
		description:
			'Whether the recipient can share the issued credential externally',
	},
	{
		displayName: 'Add to LinkedIn',
		name: 'linkedIn',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: showOnlyForCredentialIssue,
		},
		description:
			'Whether the recipient can add the issued credential to their LinkedIn profile',
	},
];