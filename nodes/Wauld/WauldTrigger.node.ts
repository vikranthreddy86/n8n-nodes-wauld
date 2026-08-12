import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';

import {
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

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
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts the workflow when a credential is issued in Wauld',
		defaults: {
			name: 'Wauld Trigger',
		},
		usableAsTool: true,
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
				displayName: 'Event',
				name: 'event',
				type: 'options',
				options: [
					{
						name: 'Credential Issued',
						value: 'CREDENTIAL_ISSUED',
					},
				],
				default: 'CREDENTIAL_ISSUED',
				required: true,
				description: 'The Wauld event that starts the workflow',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				return webhookData.webhookId !== undefined;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');

				if (!webhookUrl) {
					throw new NodeOperationError(
						this.getNode(),
						'Could not determine the n8n webhook URL',
					);
				}

				const credentials = await this.getCredentials('wauldApi');

				const response = (await this.helpers.httpRequestWithAuthentication.call(
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
							name: 'n8n Credential Issued',
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
					typeof (nestedWebhook as IDataObject).id === 'string'
				) {
					webhookId = (nestedWebhook as IDataObject).id as string;
				}

				if (!webhookId) {
					throw new NodeOperationError(
						this.getNode(),
						'Wauld created the webhook but did not return a webhook ID',
					);
				}

				const webhookData = this.getWorkflowStaticData('node');

				webhookData.webhookId = webhookId;

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

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
							error instanceof Error ? error.message : String(error)
						}`,
					);
				}

				delete webhookData.webhookId;

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();

		return {
			workflowData: [
				this.helpers.returnJsonArray([
					{
						...bodyData,
					},
				]),
			],
		};
	}
}