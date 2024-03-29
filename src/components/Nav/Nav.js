import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MENU_ITEMS } from '../../constants/Constants';
import { auth } from '../Auth/Auth';
import './Nav.scss';

function Nav({ userInfo }) {
  const pathname = useLocation().pathname;
  // console.log('pathname', pathname);

  const handleLogout = () => {
    auth.logout();
  };

  const getActiveMenuItems = (roleArray, menuItems) => {
    menuItems.forEach((item, index) => {
      if (item.subItems) {
        getActiveMenuItems(roleArray, item.subItems);
      } else {
        if (!auth.rolesHasPermission(roleArray, item.path)) {
          // ĐỪNG dùng splice, bởi vì JS bất đồng bộ nên sẽ bị lỗi thỉnh thoảng bị miss menu item
          // menuItems.splice(index, 1);
          item.enabled = false;
        } else {
          item.enabled = true;
        }
      }
    });
  };

  const generateMenu = (menuItems) => {
    return menuItems.map((item) => {
      const itemClass = 'menu-item' + (item.path === pathname ? ' active-menu' : '');
      if (item.path === null) item.path = '#';

      if (item.subItems) {
        return (
          <li key={item.key} className={`${itemClass} menu-parent level${item.level}`}>
            <Link to={item.path}>
              {item.name}&nbsp;
              <i
                className={'caret fa ' + (item.level > 1 ? 'fa-caret-right' : 'fa-caret-down')}
                onClick={(e) => e.preventDefault()}
              ></i>
            </Link>
            <ul key={item.key} className={itemClass + ' sub-menu level' + (item.level + 1)}>
              {generateMenu(item.subItems)}
            </ul>
          </li>
        );
      } else {
        return (
          item.enabled && (
            <li
              key={item.key}
              className={`${itemClass} level${item.level} ${item.className ? item.className : ''}`}
              title={item.title ? item.title : ''}
            >
              <Link to={item.path}>{item.name}</Link>
            </li>
          )
        );
      }
    });
  };

  const roleArray = userInfo ? userInfo.roleArray : [];
  const menuItems = [...MENU_ITEMS];
  getActiveMenuItems(roleArray, menuItems);

  return (
    <nav className="custom-navbar">
      <ul className="nav-wrapper">{generateMenu(menuItems)}</ul>
      <div className="userinfo-wrapper">
        {!userInfo && <Link to="/login">Login</Link>}
        {userInfo && (
          <div>
            {userInfo.name} (
            <span className="logout-link" onClick={handleLogout}>
              Logout
            </span>
            )
          </div>
        )}
      </div>
    </nav>
  );
}

export default Nav;
