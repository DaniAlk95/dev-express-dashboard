import {
  DashboardControlArgs,
  DashboardPanelExtension,
} from 'devexpress-dashboard';
import DashboardControl, {
  DataInspector,
  Extensions,
  FetchRemoteService,
} from 'devexpress-dashboard-react';
import { TextBoxItemEditorExtension } from 'devexpress-dashboard/designer/text-box-item-editor-extension';
import LeafletMapItem from './CustomDashboardItem/LeafletMapItem';
import OnlineMapItem from './CustomDashboardItem/OnlineMapItem';

function onBeforeRender(e: DashboardControlArgs) {
  const dashboardControl = e.component;

  dashboardControl.registerExtension(
    new DashboardPanelExtension(dashboardControl)
  );
  dashboardControl.registerExtension(
    new TextBoxItemEditorExtension(dashboardControl)
  );
  dashboardControl.registerExtension(new OnlineMapItem(dashboardControl));
  dashboardControl.registerExtension(new LeafletMapItem(dashboardControl));
}

function App() {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          right: '0px',
          bottom: '0px',
        }}
      >
        <DashboardControl
          style={{ height: '100%' }}
          endpoint="http://10.4.28.80:81/gw/api/analytics/dashboard"
          onBeforeRender={onBeforeRender}

          // workingMode='ViewerOnly'
        >
          <Extensions>
            <DataInspector
              allowInspectAggregatedData="true"
              allowInspectRawData="true"
            />
          </Extensions>
          <FetchRemoteService
            headers={{
              Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
            }}
          />
        </DashboardControl>
      </div>
    </>
  );
}

export default App;
