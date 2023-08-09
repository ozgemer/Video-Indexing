import React, { useEffect } from 'react';
import {
  NavContainer,
  NavLink,
  NavLinkContainer,
  NavContentContainer,
} from './Navbar.styled';
import Gear from '../../assets/icons/settings.png';
import Profile from '../../assets/icons/profile.png';
import Logo from '../../assets/images/logo.png';
import { Outlet, Link } from 'react-router-dom';
import { useRef } from 'react';

let defPages = ['home', 'search', 'upload'];
function Navbar() {
  const selected = () => {
    const split = window.location.href.split('/');
    return split[split.length - 1];
  };
  const [page, setPage] = React.useState(selected);
  const isLoaded = useRef(false);
  useEffect(() => {
    if (!isLoaded.current) {
      isLoaded.current = true;
      return;
    }
    const result = selected();
    let isVideo = true;
    defPages.forEach((p) => {
      if (p === result || p === 'video') isVideo = false;
    });
    if (isVideo) {
      defPages.push('video');
      setPage('video');
    } else {
      defPages = ['home', 'search', 'upload'];
    }
  });
  function Pages({ pages }) {
    return (
      <>
        {pages.map((p, index) => {
          return (
            <NavLink
              key={index}
              className={`${p === page && 'current'} shrink-border`}
            >
              <Link to={p} key={p + index} onClick={() => setPage(p)}>
                {p}
              </Link>
            </NavLink>
          );
        })}
        <Outlet />
      </>
    );
  }
  return (
    <NavContentContainer>
      <NavContainer>
        <NavLinkContainer className='nav-left'>
          <img
            className='nav-logo'
            src={Logo}
            alt='logo'
            width={50}
            height={48}
            style={{ margin: '0 0.75rem' }}
            onClick={() => window.location.replace(`home`)}
          />
          <Pages pages={defPages} />
        </NavLinkContainer>
        <div className='nav-right'>
          <img
            className='nav-profile'
            src={Profile}
            alt='profile'
            width={35}
            height={35}
          />
          <img
            className='nav-gear'
            src={Gear}
            alt='profile'
            width={35}
            height={35}
          />
        </div>
      </NavContainer>
    </NavContentContainer>
  );
}

export default Navbar;
