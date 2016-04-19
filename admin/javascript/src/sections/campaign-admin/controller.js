import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import backend from 'silverstripe-backend';
import * as actions from 'state/campaign/actions';
import SilverStripeComponent from 'silverstripe-component';
import FormAction from 'components/form-action/index';
import i18n from 'i18n';
import NorthHeader from 'components/north-header/index';
import FormBuilder from 'components/form-builder/index';
import CampaignListContainer from './list';

class CampaignAdminContainer extends SilverStripeComponent {

  constructor(props) {
    super(props);

    this.addCampaign = this.addCampaign.bind(this);
    this.createFn = this.createFn.bind(this);
    this.publishApi = backend.createEndpointFetcher({
      url: this.props.sectionConfig.publishEndpoint.url,
      method: this.props.sectionConfig.publishEndpoint.method,
      defaultData: { SecurityID: this.props.config.SecurityID },
      payloadSchema: {
        id: { urlReplacement: ':id', remove: true },
      },
    });
  }

  componentDidMount() {
    window.ss.router(`/${this.props.sectionConfig.campaignViewRoute}`, (ctx) => {
      this.props.actions.showCampaignView(ctx.params.id, ctx.params.view);
    });
  }

  render() {
    let view = null;

    switch (this.props.view) {
      case 'show':
        view = this.renderItemListView();
        break;
      case 'edit':
        view = this.renderDetailEditView();
        break;
      default:
        view = this.renderIndexView();
    }

    return view;
  }

  /**
   * Renders the default view which displays a list of Campaigns.
   *
   * @return object
   */
  renderIndexView() {
    const schemaUrl = this.props.sectionConfig.forms.editForm.schemaUrl;

    return (
      <div className="cms-middle no-preview">
        <div className="cms-campaigns collapse in" aria-expanded="true">
          <NorthHeader>
            <h2 className="text-truncate north-header__heading">Campaigns</h2>
          </NorthHeader>
          <div className="cms-middle__scrollable">
            <div className="content-toolbar">
              <div className="btn-toolbar">
                <FormAction
                  label={i18n._t('Campaigns.ADDCAMPAIGN')}
                  icon={'plus'}
                  handleClick={this.addCampaign}
                />
              </div>
            </div>
            <FormBuilder schemaUrl={schemaUrl} createFn={this.createFn} />
          </div>
        </div>
      </div>
    );
  }

  /**
   * Renders a list of items in a Campaign.
   *
   * @return object
   */
  renderItemListView() {
    const props = {
      campaignId: this.props.campaignId,
      itemListViewEndpoint: this.props.sectionConfig.itemListViewEndpoint,
      publishApi: this.publishApi,
      breadcrumbs: this.getBreadcrumbs(),
    };

    return (
      <CampaignListContainer {...props} />
    );
  }

  /**
   * @todo
   */
  renderDetailEditView() {
    return <p>Edit</p>;
  }

  /**
   * Hook to allow customisation of components being constructed by FormBuilder.
   *
   * @param object Component - Component constructor.
   * @param object props - Props passed from FormBuilder.
   *
   * @return object - Instanciated React component
   */
  createFn(Component, props) {
    const campaignViewRoute = this.props.sectionConfig.campaignViewRoute;

    if (props.component === 'GridField') {
      const extendedProps = Object.assign({}, props, {
        data: Object.assign({}, props.data, {
          handleDrillDown: (event, record) => {
            // Set url and set list
            const path = campaignViewRoute
              .replace(/:type\?/, 'set')
              .replace(/:id\?/, record.ID)
              .replace(/:view\?/, 'show');

            window.ss.router.show(path);
          },
        }),
      });

      return <Component key={extendedProps.name} {...extendedProps} />;
    }

    return <Component key={props.name} {...props} />;
  }

  /**
   * @todo Use dynamic breadcrumbs
   */
  getBreadcrumbs() {
    return [
      {
        text: 'Campaigns',
        href: 'admin/campaigns',
      },
      {
        text: 'March release',
        href: 'admin/campaigns/show/1',
      },
    ];
  }

  /**
   * Gets preview URL for itemid
   * @param int id
   * @returns string
   */
  previewURLForItem(id) {
    if (!id) {
      return '';
    }

    // hard code in baseurl for any itemid preview url
    return document.getElementsByTagName('base')[0].href;
  }

  addCampaign() {
    // Add campaign
  }

}

CampaignAdminContainer.propTypes = {
  sectionConfig: React.PropTypes.shape({
    forms: React.PropTypes.shape({
      editForm: React.PropTypes.shape({
        schemaUrl: React.PropTypes.string,
      }),
    }),
  }),
  config: React.PropTypes.shape({
    SecurityID: React.PropTypes.string,
  }),
  sectionConfigKey: React.PropTypes.string.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    config: state.config,
    sectionConfig: state.config.sections[ownProps.sectionConfigKey],
    campaignId: state.campaign.campaignId,
    view: state.campaign.view,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignAdminContainer);