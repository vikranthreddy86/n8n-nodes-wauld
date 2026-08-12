# n8n-nodes-wauld

This is an n8n community node that lets you integrate [Wauld](https://wauld.com) with your n8n workflows.

Wauld is a digital credentialing platform that enables organizations to create, issue, manage, and verify digital credentials.

[n8n](https://n8n.io/) is a workflow automation platform that lets you connect applications and automate workflows.

- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Usage](#usage)
- [Webhook Requirements](#webhook-requirements)
- [Resources](#resources)
- [Version History](#version-history)

## Installation

Follow the [n8n community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

The package name is:

`n8n-nodes-wauld`

## Operations

The Wauld integration provides one trigger and one action.

### Trigger

#### New Credential Issued

Triggers when a new credential is issued.

The trigger lets you select a:

- Workspace
- Engagement
- Document

The workflow runs only when a credential is issued using the selected document.

### Action

#### Issue Credential

Issues a new credential using the selected document and recipient details.

The action supports:

- Workspace
- Engagement
- Document
- Recipient Name
- Recipient Email
- Custom Attributes
- Expiry Date
- Shareable
- Add to LinkedIn

## Credentials

To connect Wauld to n8n, you need an Access Token and Account ID.

### Access Token

You can find your access token in Wauld under **Integrations > n8n Integration**.

Click **Generate Token**, then copy and paste the token into the **Access Token** field in n8n.

### Account ID

You can find your Wauld Account ID in the URL after `wauld.com/`.

The Account ID starts with `acc_`.

Copy and paste the complete Account ID into the **Account ID** field in n8n.

## Compatibility

This node has been tested with n8n 2.34.5.

Other n8n versions have not yet been formally tested.

## Usage

### Issue a Credential

To issue a credential from an n8n workflow:

1. Add the **Wauld** node to your workflow.
2. Connect your Wauld account.
3. Select **Credential** as the resource.
4. Select **Issue Credential** as the operation.
5. Choose the workspace where the document is located.
6. Choose the engagement that contains the document.
7. Choose the document to issue.
8. Enter the recipient's name.
9. Enter the recipient's email address.
10. Map any custom attributes required by the selected document.
11. Set an expiry date if the credential should expire.
12. Configure the **Shareable** and **Add to LinkedIn** options.
13. Run the workflow.

Wauld will issue the credential using the selected document and recipient details.

### Custom Attributes

Custom Attributes are loaded from the selected Wauld document.

For each custom attribute, select the attribute name and provide the recipient-specific value.

### Expiry Date

The **Expiry Date** field is optional.

Leave this field blank if the credential should not expire.

### Shareable

Use the **Shareable** option to control whether the recipient can share the issued credential externally.

### Add to LinkedIn

Use the **Add to LinkedIn** option to control whether the recipient can add the issued credential to their LinkedIn profile.

### New Credential Issued Trigger

The **New Credential Issued** trigger starts an n8n workflow when a new credential is issued in Wauld.

To configure the trigger:

1. Add the **Wauld Trigger** node to your workflow.
2. Connect your Wauld account.
3. Choose the workspace where the relevant document is located.
4. Choose the engagement that contains the document.
5. Choose the document you want the workflow to monitor.
6. Activate the workflow.

The workflow runs whenever a credential is issued using the selected document.

Credentials issued using other documents do not trigger the workflow.

## Webhook Requirements

The **New Credential Issued** trigger uses Wauld webhooks.

Your n8n instance must have a publicly accessible webhook URL that Wauld can reach.

When the trigger is activated, the integration registers a webhook with Wauld for credential issued events.

When the webhook is removed, the integration removes the associated webhook from Wauld.

## Resources

- [Wauld](https://wauld.com)
- [n8n](https://n8n.io/)
- [n8n Documentation](https://docs.n8n.io/)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [GitHub Repository](https://github.com/vikranthreddy86/n8n-nodes-wauld)

## Version History

### 0.1.0

Initial release.

- Added the **Issue Credential** action.
- Added the **New Credential Issued** trigger.
- Added Workspace, Engagement, and Document selection.
- Added document-specific trigger filtering.
- Added Recipient Name and Recipient Email support.
- Added Custom Attributes support.
- Added optional credential expiry.
- Added Shareable control.
- Added Add to LinkedIn control.
- Added webhook support for credential issued events.