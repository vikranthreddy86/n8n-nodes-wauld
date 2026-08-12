import type {
	IDataObject,
	IHookFunctions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';

import {
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

interface WauldWorkspace {
	id?: string;
	name?: string;
}

interface WauldEngagement {
	id?: string;
	name?: string;
}

interface WauldDocument {
	id?: string;
	name?: string;
}

interface ListWorkspacesResponse {
	workspaces?: WauldWorkspace[];
}

interface ListEngagementsResponse {
	engagements?: WauldEngagement[];
}

interface ListDocumentsResponse {
	documents?: WauldDocument[];
}

export class WauldTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wauld Trigger',
		name: 'wauldTrigger',
		icon: {
			light: 'file:wauld.svg',
			dark: 'file:wauld.dark.svg',
		},
		group: ['trigger'],
		version: 1,
		subtitle: 'New Credential Issued',
        description: 'Triggers when a new credential is issued',
        eventTriggerDescription: 'Waiting for a new credential to be issued in Wauld',

		defaults: {
			name: 'Wauld Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'wauldApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'credential-issued',
			},
		],
		properties: [
			{
				displayName: 'Workspace Name or ID',
				name: 'workspace',
				type: 'options',
				required: true,
				default: '',
				noDataExpression: true,
				description: 'Choose from the list, or specify an ID using an expression. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				hint: 'Choose the Wauld workspace where the relevant document is located.',
				typeOptions: {
					loadOptionsMethod: 'getWorkspaces',
				},
			},
			{
				displayName: 'Engagement Name or ID',
				name: 'engagement',
				type: 'options',
				required: true,
				default: '',
				noDataExpression: true,
				description: 'Choose from the list, or specify an ID using an expression. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				hint: 'Choose the engagement that contains the document you want this workflow to monitor.',
				typeOptions: {
					loadOptionsMethod: 'getEngagements',
					loadOptionsDependsOn: ['workspace'],
				},
			},
			{
				displayName: 'Document Name or ID',
				name: 'document',
				type: 'options',
				required: true,
				default: '',
				noDataExpression: true,
				description: 'Choose from the list, or specify an ID using an expression. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				hint: 'Choose the document for this trigger. The workflow will run whenever a credential is issued for this document.',
				typeOptions: {
					loadOptionsMethod: 'getDocuments',
					loadOptionsDependsOn: ['engagement'],
				},
			},
		],
	};

	methods = {
		loadOptions: {
			async getWorkspaces(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('wauldApi');

				const accountId = credentials.accountId;

				if (typeof accountId !== 'string' || accountId.length === 0) {
					return [];
				}

				const response =
					(await this.helpers.httpRequestWithAuthentication.call(
						this,
						'wauldApi',
						{
							method: 'POST',
							url: 'https://wauld.com/wauld.WorkspaceService/ListWorkspaces',
							headers: {
								'Content-Type': 'application/json',
								'Connect-Protocol-Version': '1',
							},
							body: {
								parent: accountId,
								pageSize: 25,
							},
							json: true,
						},
					)) as ListWorkspacesResponse;

				const workspaces = Array.isArray(response.workspaces)
					? response.workspaces
					: [];

				return workspaces
					.filter(
						(
							workspace,
						): workspace is Required<
							Pick<WauldWorkspace, 'id' | 'name'>
						> =>
							typeof workspace.id === 'string' &&
							typeof workspace.name === 'string',
					)
					.map((workspace) => ({
						name: workspace.name,
						value: workspace.id,
					}))
					.sort((a, b) => a.name.localeCompare(b.name));
			},

			async getEngagements(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				const workspace =
					this.getCurrentNodeParameter('workspace');

				if (
					typeof workspace !== 'string' ||
					workspace.length === 0
				) {
					return [];
				}

				const response =
					(await this.helpers.httpRequestWithAuthentication.call(
						this,
						'wauldApi',
						{
							method: 'POST',
							url: 'https://wauld.com/wauld.EngagementService/ListEngagements',
							headers: {
								'Content-Type': 'application/json',
								'Connect-Protocol-Version': '1',
							},
							body: {
								parent: workspace,
								pageSize: 10,
							},
							json: true,
						},
					)) as ListEngagementsResponse;

				const engagements = Array.isArray(response.engagements)
					? response.engagements
					: [];

				return engagements
					.filter(
						(
							engagement,
						): engagement is Required<
							Pick<WauldEngagement, 'id' | 'name'>
						> =>
							typeof engagement.id === 'string' &&
							typeof engagement.name === 'string',
					)
					.map((engagement) => ({
						name: engagement.name,
						value: engagement.id,
					}))
					.sort((a, b) => a.name.localeCompare(b.name));
			},

			async getDocuments(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				const engagement =
					this.getCurrentNodeParameter('engagement');

				if (
					typeof engagement !== 'string' ||
					engagement.length === 0
				) {
					return [];
				}

				const response =
					(await this.helpers.httpRequestWithAuthentication.call(
						this,
						'wauldApi',
						{
							method: 'POST',
							url: 'https://wauld.com/wauld.DocumentService/ListDocuments',
							headers: {
								'Content-Type': 'application/json',
								'Connect-Protocol-Version': '1',
							},
							body: {
								parent: engagement,
								pageSize: 10,
							},
							json: true,
						},
					)) as ListDocumentsResponse;

				const documents = Array.isArray(response.documents)
					? response.documents
					: [];

				return documents
					.filter(
						(
							document,
						): document is Required<
							Pick<WauldDocument, 'id' | 'name'>
						> =>
							typeof document.id === 'string' &&
							typeof document.name === 'string',
					)
					.map((document) => ({
						name: document.name,
						value: document.id,
					}))
					.sort((a, b) => a.name.localeCompare(b.name));
			},
		},
	};

	webhookMethods = {
		default: {
			async checkExists(
				this: IHookFunctions,
			): Promise<boolean> {
				const webhookData =
					this.getWorkflowStaticData('node');

				return webhookData.webhookId !== undefined;
			},

			async create(
				this: IHookFunctions,
			): Promise<boolean> {
				const webhookUrl =
					this.getNodeWebhookUrl('default');

				if (!webhookUrl) {
					throw new NodeOperationError(
						this.getNode(),
						'Could not determine the n8n webhook URL',
					);
				}

				if (webhookUrl.includes('//localhost')) {
					throw new NodeOperationError(
						this.getNode(),
						'Wauld cannot reach a localhost webhook URL. Configure a publicly accessible n8n webhook URL.',
					);
				}

				const credentials =
					await this.getCredentials('wauldApi');

				const response =
					(await this.helpers.httpRequestWithAuthentication.call(
						this,
						'wauldApi',
						{
							method: 'POST',
							url: 'https://wauld.com/wauld.WebhookService/CreateWebhook',
							headers: {
								'Content-Type': 'application/json',
								'Connect-Protocol-Version': '1',
							},
							body: {
								parent: credentials.accountId,
								url: webhookUrl,
								events: ['CREDENTIAL_ISSUED'],
								name: `n8n Credential Issued - ${this.getNode().id.slice(0, 8)}`,
							},
							json: true,
						},
					)) as IDataObject;

				let webhookId: string | undefined;

				if (typeof response.id === 'string') {
					webhookId = response.id;
				}

				const nestedWebhook = response.webhook;

				if (
					!webhookId &&
					nestedWebhook &&
					typeof nestedWebhook === 'object' &&
					typeof (nestedWebhook as IDataObject).id ===
						'string'
				) {
					webhookId = (nestedWebhook as IDataObject)
						.id as string;
				}

				if (!webhookId) {
					throw new NodeOperationError(
						this.getNode(),
						'Wauld created the webhook but did not return a webhook ID',
					);
				}

				const webhookData =
					this.getWorkflowStaticData('node');

				webhookData.webhookId = webhookId;

				return true;
			},

			async delete(
				this: IHookFunctions,
			): Promise<boolean> {
				const webhookData =
					this.getWorkflowStaticData('node');

				if (webhookData.webhookId === undefined) {
					return true;
				}

				try {
					await this.helpers.httpRequestWithAuthentication.call(
						this,
						'wauldApi',
						{
							method: 'POST',
							url: 'https://wauld.com/wauld.WebhookService/DeleteWebhook',
							headers: {
								'Content-Type': 'application/json',
								'Connect-Protocol-Version': '1',
							},
							body: {
								id: webhookData.webhookId,
							},
							json: true,
						},
					);
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`Failed to delete Wauld webhook: ${
							error instanceof Error
								? error.message
								: String(error)
						}`,
					);
				}

				delete webhookData.webhookId;

				return true;
			},
		},
	};

	async webhook(
		this: IWebhookFunctions,
	): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;

		const selectedDocument = this.getNodeParameter(
			'document',
		) as string;

		const document = bodyData.document;

		if (!document || typeof document !== 'object') {
			return {};
		}

		const issuedDocumentId = (document as IDataObject).id;

		if (issuedDocumentId !== selectedDocument) {
			return {};
		}

		return {
			workflowData: [
				this.helpers.returnJsonArray([bodyData]),
			],
		};
	}
}