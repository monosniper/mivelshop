import {NavLink} from "./NavLink";

export { Nav };

function Nav() {
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav">
                <NavLink href="/admin" exact className="nav-item nav-link">Админ панель</NavLink>
                <NavLink href="/admin/users" className="nav-item nav-link">Пользователи</NavLink>
                <NavLink href="/admin/categories" className="nav-item nav-link">Категории</NavLink>
                <NavLink href="/admin/products" className="nav-item nav-link">Товары</NavLink>
                <NavLink href="/admin/digital" className="nav-item nav-link">Digital</NavLink>
                <NavLink href="/admin/orders" className="nav-item nav-link">Заказы</NavLink>
            </div>
        </nav>
    );
}