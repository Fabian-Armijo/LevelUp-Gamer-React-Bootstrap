import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductService from '../../../services/ProductService';
import { useAuth } from '../../../context/AuthContext';
import './AdminDashboard.css';

// --- SUB-COMPONENTE: GRÁFICO DE BARRAS SIMPLE (Sin librerías) ---
const SimpleBarChart = ({ data, label }) => {
    const maxVal = Math.max(...data.map(d => d.value));
    return (
        <div className="chart-container">
            <h3>{label}</h3>
            <div className="chart-bars">
                {data.map((item, index) => (
                    <div key={index} className="chart-column">
                        <div 
                            className="bar" 
                            style={{ height: `${(item.value / maxVal) * 100}%` }}
                            title={`${item.label}: $${item.value}`}
                        ></div>
                        <span className="bar-label">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- SUB-COMPONENTE: VISTA GENERAL (HOME) ---
const AdminOverview = () => {
    const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month'
    
    // Datos simulados (Aquí conectarías con un OrderService.getStats() en el futuro)
    const getMockData = (range) => {
        if (range === 'day') return [
            { label: '09:00', value: 15000 }, { label: '12:00', value: 45000 }, 
            { label: '15:00', value: 30000 }, { label: '18:00', value: 60000 }, { label: '21:00', value: 25000 }
        ];
        if (range === 'week') return [
            { label: 'Lun', value: 120000 }, { label: 'Mar', value: 150000 }, 
            { label: 'Mié', value: 180000 }, { label: 'Jue', value: 90000 }, 
            { label: 'Vie', value: 250000 }, { label: 'Sáb', value: 300000 }, { label: 'Dom', value: 110000 }
        ];
        return [ // Month
            { label: 'Sem 1', value: 800000 }, { label: 'Sem 2', value: 950000 },
            { label: 'Sem 3', value: 600000 }, { label: 'Sem 4', value: 1200000 }
        ];
    };

    const stats = {
        totalSales: 2540000,
        orders: 142,
        avgTicket: 17800
    };

    return (
        <div className="admin-view fade-in">
            <div className="admin-header">
                <h2>Resumen de Ventas</h2>
                <div className="time-filters">
                    <button className={timeRange === 'day' ? 'active' : ''} onClick={() => setTimeRange('day')}>Hoy</button>
                    <button className={timeRange === 'week' ? 'active' : ''} onClick={() => setTimeRange('week')}>Semana</button>
                    <button className={timeRange === 'month' ? 'active' : ''} onClick={() => setTimeRange('month')}>Mes</button>
                </div>
            </div>

            {/* Tarjetas de KPI */}
            <div className="kpi-grid">
                <div className="kpi-card blue">
                    <h3>Ventas Totales</h3>
                    <p>${stats.totalSales.toLocaleString('es-CL')}</p>
                    <span className="trend positive">↑ 12% vs periodo anterior</span>
                </div>
                <div className="kpi-card green">
                    <h3>Pedidos</h3>
                    <p>{stats.orders}</p>
                    <span className="trend positive">↑ 5% nuevos clientes</span>
                </div>
                <div className="kpi-card purple">
                    <h3>Ticket Promedio</h3>
                    <p>${stats.avgTicket.toLocaleString('es-CL')}</p>
                    <span className="trend negative">↓ 2% vs periodo anterior</span>
                </div>
            </div>

            {/* Gráfico */}
            <div className="chart-section">
                <SimpleBarChart data={getMockData(timeRange)} label={`Rendimiento por ${timeRange === 'week' ? 'Semana' : timeRange === 'day' ? 'Hora' : 'Mes'}`} />
            </div>
        </div>
    );
};

// --- SUB-COMPONENTE: GESTIÓN DE PRODUCTOS (CRUD) ---
const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null); // null = create, object = edit

    // Estado del formulario
    const [formData, setFormData] = useState({ name: '', price: 0, category: '', description: '', imageUrl: '', manufacturer: '' });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {
        setIsLoading(true);
        ProductService.getAllProducts()
            .then(res => setProducts(res.data))
            .catch(err => console.error("Error cargando productos", err))
            .finally(() => setIsLoading(false));
    };

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setFormData({ 
            name: product.name, 
            price: product.price, 
            category: product.category, 
            description: product.description,
            imageUrl: product.imageUrl,
            manufacturer: product.manufacturer || ''
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este producto?")) {
            try {
                await ProductService.deleteProduct(id);
                loadProducts(); // Recargar lista
            } catch (error) {
                alert("Error al eliminar");
            }
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentProduct) {
                // Update
                await ProductService.updateProduct(currentProduct.id, formData);
            } else {
                // Create
                await ProductService.createProduct(formData);
            }
            setIsFormOpen(false);
            setCurrentProduct(null);
            setFormData({ name: '', price: 0, category: '', description: '', imageUrl: '', manufacturer: '' });
            loadProducts();
        } catch (error) {
            console.error(error);
            alert("Error al guardar el producto");
        }
    };

    return (
        <div className="admin-view fade-in">
            <div className="admin-header">
                <h2>Inventario de Productos</h2>
                <button className="btn-primary-admin" onClick={() => { setCurrentProduct(null); setFormData({ name: '', price: 0, category: '', description: '', imageUrl: '' }); setIsFormOpen(true); }}>
                    + Nuevo Producto
                </button>
            </div>

            {/* TABLA DE PRODUCTOS */}
            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Img</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td><img src={p.imageUrl} alt="mini" className="table-img" /></td>
                                <td>{p.name}</td>
                                <td><span className="badge">{p.category}</span></td>
                                <td>${p.price.toLocaleString('es-CL')}</td>
                                <td>
                                    <button className="action-btn edit" onClick={() => handleEdit(p)}>✏️</button>
                                    <button className="action-btn delete" onClick={() => handleDelete(p.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {isLoading && <p className="text-center mt-4">Cargando inventario...</p>}
            </div>

            {/* MODAL / FORMULARIO FLOTANTE */}
            {isFormOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h3>{currentProduct ? 'Editar Producto' : 'Crear Producto'}</h3>
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label>Nombre</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Precio</label>
                                    <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
                                </div>
                                <div className="form-group">
                                    <label>Categoría</label>
                                    <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>URL Imagen</label>
                                <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3"></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary-admin" onClick={() => setIsFormOpen(false)}>Cancelar</button>
                                <button type="submit" className="btn-primary-admin">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- COMPONENTE PRINCIPAL: LAYOUT DEL DASHBOARD ---
const AdminDashboard = () => {
    const [activeView, setActiveView] = useState('overview'); // 'overview', 'products', 'settings'
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    // Protección extra (aunque ProtectedRoute ya lo hace)
    useEffect(() => {
        if (user && user.userRole !== 'ROLE_ADMIN') {
            navigate('/');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            {/* 1. SIDEBAR IZQUIERDO */}
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <h2>Admin<span>Panel</span></h2>
                </div>
                
                <nav className="admin-nav">
                    <ul>
                        <li className={activeView === 'overview' ? 'active' : ''} onClick={() => setActiveView('overview')}>
                            <span className="icon">📊</span> Dashboard
                        </li>
                        <li className={activeView === 'products' ? 'active' : ''} onClick={() => setActiveView('products')}>
                            <span className="icon">📦</span> Productos
                        </li>
                        {/* Escalabilidad: Aquí puedes añadir 'Usuarios', 'Pedidos', etc. */}
                        <li className="disabled" title="Próximamente">
                            <span className="icon">👥</span> Usuarios
                        </li>
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={() => navigate('/')} className="back-store-btn">⬅ Ir a Tienda</button>
                    <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
                </div>
            </aside>

            {/* 2. ÁREA DE CONTENIDO PRINCIPAL */}
            <main className="admin-main">
                <header className="top-bar">
                    <div className="breadcrumbs">Admin / {activeView === 'overview' ? 'Resumen' : 'Productos'}</div>
                    <div className="admin-profile">
                        <span>Hola, Admin</span>
                        <div className="admin-avatar">A</div>
                    </div>
                </header>

                <div className="content-wrapper">
                    {activeView === 'overview' && <AdminOverview />}
                    {activeView === 'products' && <AdminProducts />}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;