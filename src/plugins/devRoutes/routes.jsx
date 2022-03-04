import React from 'react';
import { Link, withRouter } from 'umi';

import './routes.less';

class RoutesList extends React.Component {
  state = {
    loading: true,
    routes: [],
  };

  componentDidMount() {
    fetch('/__umiDev/routes')
      .then((res) => res.json())
      .then((routes) => {
        this.setState({
          loading: false,
          routes,
        });
      });
  }

  renderRoutes(routes) {
    return (
      <ul>
        {routes.map((route, i) => {
          if (!route.path) return null;
          return (
            <li key={route.key || i}>
              <Link to={route.path}>{route.path}</Link>
              {route.routes ? this.renderRoutes(route.routes) : null}
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    return (
      <div className="umi-dev-routes">
        <h1>umi development routes</h1>
        <h2>Your Routes</h2>
        {this.state.loading ? (
          <div>Loading routes...</div>
        ) : (
          this.renderRoutes(this.state.routes)
        )}
      </div>
    );
  }
}

export default withRouter(RoutesList);
