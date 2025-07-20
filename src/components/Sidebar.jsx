import { ListIcon } from '~/icons/ListIcon'
import './Sidebar.css'
import { Link, useLocation } from 'react-router-dom'
import { PlusIcon } from '~/icons/PlusIcon'
import { HamburgerIcon } from '~/icons/HamburgerIcon'
import { CloseIcon } from '~/icons/CloseIcon'
import { useSelector, useDispatch } from 'react-redux'
import { useLogout } from '~/hooks/useLogout'
import { useEffect, useState } from 'react'
import { fetchLists } from '~/store/list/index'
import { ListCreateModal } from './ListCreateModal'

export const Sidebar = () => {
  const dispatch = useDispatch()
  const { pathname } = useLocation()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const lists = useSelector((state) => state.list.lists)
  const activeId = useSelector((state) => state.list.current)
  const isLoggedIn = useSelector((state) => state.auth.token !== null)
  const userName = useSelector((state) => state.auth.user?.name)

  // リスト新規作成ページではリストをハイライトしない
  const shouldHighlight = !pathname.startsWith('/list/new')

  const { logout } = useLogout()

  useEffect(() => {
    void dispatch(fetchLists())
  }, [])

  // モバイルメニューを閉じる関数
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // リンクがクリックされたときにモバイルメニューを閉じる
  const handleLinkClick = () => {
    closeMobileMenu()
  }

  return (
    <>
      {/* ハンバーガーメニューボタン（モバイルでのみ表示） */}
      <button
        className="sidebar__mobile_toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
      >
        {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
      </button>

      {/* オーバーレイ（モバイルでメニューが開いているときに表示） */}
      {isMobileMenuOpen && (
        <div
          className="sidebar__overlay"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <div className={`sidebar ${isMobileMenuOpen ? 'sidebar--open' : ''}`}>
        <Link to="/" onClick={handleLinkClick}>
          <h1 className="sidebar__title">Todos</h1>
        </Link>
        {isLoggedIn ? (
          <>
            {lists && (
              <div className="sidebar__lists">
                <h2 className="sidebar__lists_title">Lists</h2>
                <ul className="sidebar__lists_items">
                  {lists.map((listItem) => (
                    <li key={listItem.id}>
                      <Link
                        data-active={
                          shouldHighlight && listItem.id === activeId
                        }
                        to={`/lists/${listItem.id}`}
                        className="sidebar__lists_item"
                        onClick={handleLinkClick}
                      >
                        <ListIcon aria-hidden className="sidebar__lists_icon" />
                        {listItem.title}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => {
                        setIsCreateModalOpen(true)
                        closeMobileMenu()
                      }}
                      className="sidebar__lists_button"
                    >
                      <PlusIcon className="sidebar__lists_plus_icon" />
                      New List...
                    </button>
                  </li>
                </ul>
              </div>
            )}
            <div className="sidebar__spacer" aria-hidden />
            <div className="sidebar__account">
              <p className="sidebar__account_name">{userName}</p>
              <button
                type="button"
                className="sidebar__account_logout"
                onClick={() => {
                  logout()
                  closeMobileMenu()
                }}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link
              to="/signin"
              className="sidebar__login"
              onClick={handleLinkClick}
            >
              Login
            </Link>
          </>
        )}
        <ListCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </>
  )
}
