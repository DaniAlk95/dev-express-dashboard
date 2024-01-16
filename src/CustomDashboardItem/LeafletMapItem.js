import { CustomItemViewer } from 'devexpress-dashboard/common';
import { CustomItem } from 'devexpress-dashboard/model';
import L from 'leaflet';
const MAP_EXTENSION_NAME = 'OpenStreetMap';

const svgIcon = `
<svg id="${MAP_EXTENSION_NAME}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m15 21l-6-2.1l-4.65 1.8q-.5.2-.925-.112T3 19.75v-14q0-.325.188-.575T3.7 4.8L9 3l6 2.1l4.65-1.8q.5-.2.925.113T21 4.25v14q0 .325-.187.575t-.513.375zm-1-2.45V6.85l-4-1.4v11.7zm2 0l3-1V5.7l-3 1.15zM5 18.3l3-1.15V5.45l-3 1zM16 6.85v11.7zm-8-1.4v11.7z"/></svg>`;

const mapMetadata = {
  bindings: [
    {
      propertyName: 'Latitude',
      dataItemType: 'Dimension',
      array: false,
      enableInteractivity: true,
      displayName: 'Latitude',
      emptyPlaceholder: 'Set Latitude',
      selectedPlaceholder: 'Configure Latitude',
      constraints: {
        allowedTypes: ['Integer', 'Float', 'Double', 'Decimal'],
      },
    },
    {
      propertyName: 'Longitude',
      dataItemType: 'Dimension',
      array: false,
      enableInteractivity: true,
      displayName: 'Longitude',
      emptyPlaceholder: 'Set Longitude',
      selectedPlaceholder: 'Configure Longitude',
      constraints: {
        allowedTypes: ['Integer', 'Float', 'Double', 'Decimal'],
      },
    },
    {
      propertyName: 'Tooltip',
      dataItemType: 'Dimension',
      array: false,
      enableInteractivity: true,
      displayName: 'Tooltip',
      emptyPlaceholder: 'Set Tooltip',
      selectedPlaceholder: 'Configure Tooltip',
      constraints: {
        allowedTypes: ['Text'],
      },
    },
  ],
  customProperties: [
    {
      ownerType: CustomItem,
      propertyName: 'Provider',
      valueType: 'string',
      defaultValue: 'OpenStreetMap',
    },
    {
      ownerType: CustomItem,
      propertyName: 'Type',
      valueType: 'string',
      defaultValue: 'RoadMap',
    },
    {
      ownerType: CustomItem,
      propertyName: 'DisplayMode',
      valueType: 'string',
      defaultValue: 'Markers',
    },
  ],
  interactivity: {
    filter: true,
    drillDown: false,
  },
  icon: MAP_EXTENSION_NAME,
  title: 'Leaflet Map',
};

class LeafletMapItemViewer extends CustomItemViewer {
  constructor(model, $container, options) {
    super(model, $container, options);
    this.mapViewer = null;
  }

  setSelection(values) {
    super.setSelection(values);
  }

  clearSelection() {
    super.clearSelection();
  }
  renderContent(element, changeExisting) {
    if (!changeExisting) {
      element.innerHTML = '';
    }
    const mapDiv = document.createElement('div');
    element.appendChild(mapDiv);
    if (
      this.getBindingValue('Latitude').length > 0 &&
      this.getBindingValue('Longitude').length > 0
    ) {
      this.iterateData((row) => {
        const latitude = row.getValue('Latitude')[0];
        const longitude = row.getValue('Longitude')[0];
        const tooltip = row.getValue('Tooltip')[0];
        const latlgn = [latitude, longitude];
        if (!this.mapViewer && latitude !== null && longitude !== null) {
          this.mapViewer = L.map(mapDiv).setView(latlgn, 6);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
              'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
            maxZoom: 18,
          }).addTo(this.mapViewer);
        }
        if (!latitude || !longitude) return;
        const marker = L.marker(latlgn);
        marker.addTo(this.mapViewer).on('click', () => {
          this.setMasterFilter(row);
        });
        if (tooltip) marker.bindPopup(`<b>${tooltip}</b>`);
      });
    }
  }
}
class LeafletMapItem {
  constructor(dashboardControl) {
    dashboardControl.registerIcon(svgIcon);
    this.name = MAP_EXTENSION_NAME;
    this.metaData = mapMetadata;
  }
  createViewerItem(model, $element, content) {
    return new LeafletMapItemViewer(model, $element, content);
  }
}

export default LeafletMapItem;
