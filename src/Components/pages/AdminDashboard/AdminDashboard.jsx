import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductService from '../../../services/ProductService';
import AdminService from '../../../Services/AdminService'; 
import { useAuth } from '../../../context/AuthContext';
import './AdminDashboard.css';

// --- SUB-COMPONENTE: GRÁFICO ---
const SimpleBarChart = ({ data, label }) => {
    const maxVal = data.length > 0 ? Math.max(...data.map(d => d.value)) : 1;
    return (
        <div className="chart-container">
            <h3>{label}</h3>
            <div className="chart-bars">
                {data.map((item, index) => (
                    <div key={index} className="chart-column">
                        <div 
                            className="bar" 
                            style={{ height: `${(item.value / (maxVal || 1)) * 100}%` }}
                            title={`${item.label}: $${item.value?.toLocaleString('es-CL')}`}
                        ></div>
                        <span className="bar-label">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- SUB-COMPONENTE: VISTA GENERAL ---
const AdminOverview = () => {
    const [backendStats, setBackendStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { logout } = useAuth(); // Necesitamos logout para el error 403
    const navigate = useNavigate();

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setIsLoading(true);
            const response = await AdminService.getStats();
            setBackendStats(response.data);
            setIsLoading(false);
        } catch (err) {
            console.error("Error al cargar estadísticas:", err);
            setIsLoading(false);
            
            // MANEJO DE ERROR 403 ESPECÍFICO
            if (err.response && err.response.status === 403) {
                setError("FORBIDDEN"); // Marcador especial
            } else {
                setError("No se pudieron cargar los datos. Revisa que el backend esté corriendo.");
            }
        }
    };

    const handleForceLogout = () => {
        logout();
        navigate('/login');
    };

    if (isLoading) return <div className="p-4">Cargando estadísticas...</div>;

    // UI ESPECIAL PARA ERROR 403
    if (error === "FORBIDDEN") {
        return (
            <div className="admin-view fade-in">
                <div className="server-message error" style={{ textAlign: 'center', padding: '40px' }}>
                    <h2 style={{ color: '#ff4d4d', marginBottom: '10px' }}>⛔ Acceso Denegado (403)</h2>
                    <p style={{ marginBottom: '20px' }}>Tu usuario tiene permiso en el Frontend, pero el Backend lo rechaza.</p>
                    <ul style={{ listStyle: 'none', padding: 0, color: '#ccc', marginBottom: '20px' }}>
                        <li>1. Tu token puede haber expirado.</li>
                        <li>2. En la base de datos, el rol debe ser exactamente <strong>ROLE_ADMIN</strong>.</li>
                    </ul>
                    <button className="btn-primary-admin" onClick={handleForceLogout} style={{ backgroundColor: '#ff4d4d' }}>
                        Cerrar Sesión y Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!backendStats) return null;

    const chartData = [
        { label: 'Hoy', value: backendStats.salesToday || 0 },
        { label: 'Semana', value: backendStats.salesWeek || 0 },
        { label: 'Mes', value: backendStats.salesMonth || 0 },
    ];

    return (
        <div className="admin-view fade-in">
            <div className="admin-header">
                <h2>Resumen de Ventas</h2>
                <div className="time-filters">
                    <span className="badge">Actualizado: {new Date().toLocaleTimeString()}</span>
                </div>
            </div>

            <div className="kpi-grid">
                <div className="kpi-card blue">
                    <h3>Ventas Hoy</h3>
                    <p>${(backendStats.salesToday || 0).toLocaleString('es-CL')}</p>
                    <span className="trend">Pedidos: {backendStats.ordersToday || 0}</span>
                </div>
                <div className="kpi-card green">
                    <h3>Ventas Mes</h3>
                    <p>${(backendStats.salesMonth || 0).toLocaleString('es-CL')}</p>
                </div>
                <div className="kpi-card purple">
                    <h3>Ventas Año</h3>
                    <p>${(backendStats.salesYear || 0).toLocaleString('es-CL')}</p>
                </div>
            </div>

            <div className="dashboard-grid-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                <div className="chart-section">
                    <SimpleBarChart data={chartData} label="Ingresos" />
                </div>
                <div className="recent-orders-section table-container">
                    <h3 style={{ padding: '15px', borderBottom: '1px solid #333' }}>Últimos Pedidos</h3>
                    <table className="admin-table">
                        <thead>
                            <tr><th>ID</th><th>Fecha</th><th>Total</th></tr>
                        </thead>
                        <tbody>
                            {backendStats.recentOrders?.length > 0 ? (
                                backendStats.recentOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                        <td>${order.totalAmount?.toLocaleString('es-CL')}</td>
                                    </tr>
                                ))
                            ) : <tr><td colSpan="3">Sin pedidos recientes</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTE: PRODUCTOS (Sin cambios mayores) ---
const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null); 
    const [formData, setFormData] = useState({ name: '', price: 0, category: '', description: '', imageUrl: '', manufacturer: '', distributor: '' });

    useEffect(() => { loadProducts(); }, []);

    const loadProducts = () => {
        setIsLoading(true);
        ProductService.getAllProducts().then(res => setProducts(res.data)).finally(() => setIsLoading(false));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentProduct) await ProductService.updateProduct(currentProduct.id, formData);
            else await ProductService.createProduct(formData);
            setIsFormOpen(false);
            loadProducts();
        } catch (error) { alert("Error al guardar."); }
    };

    // Funciones auxiliares para el formulario
    const openCreate = () => { setCurrentProduct(null); setFormData({ name: '', price: 0, category: '', description: '', imageUrl: '', manufacturer: '', distributor: '' }); setIsFormOpen(true); };
    const openEdit = (p) => { setCurrentProduct(p); setFormData({ ...p, manufacturer: p.manufacturer||'', distributor: p.distributor||'' }); setIsFormOpen(true); };
    const handleDelete = async (id) => { if(window.confirm("¿Borrar?")) { await ProductService.deleteProduct(id); loadProducts(); } };

    return (
        <div className="admin-view fade-in">
            <div className="admin-header">
                <h2>Productos</h2>
                <button className="btn-primary-admin" onClick={openCreate}>+ Nuevo</button>
            </div>
            <div className="table-container">
                <table className="admin-table">
                    <thead><tr><th>Nombre</th><th>Precio</th><th>Acciones</th></tr></thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>${p.price.toLocaleString('es-CL')}</td>
                                <td>
                                    <button className="action-btn edit" onClick={() => openEdit(p)}>✏️</button>
                                    <button className="action-btn delete" onClick={() => handleDelete(p.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isFormOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h3>{currentProduct ? 'Editar' : 'Crear'}</h3>
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-group"><label>Nombre</label><input value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} required/></div>
                            <div className="form-group"><label>Precio</label><input type="number" value={formData.price} onChange={e=>setFormData({...formData, price:Number(e.target.value)})} required/></div>
                            <div className="form-group"><label>Categoría</label><input value={formData.category} onChange={e=>setFormData({...formData, category:e.target.value})} required/></div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary-admin" onClick={()=>setIsFormOpen(false)}>Cancelar</button>
                                <button type="submit" className="btn-primary-admin">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
const AdminDashboard = () => {
    const [activeView, setActiveView] = useState('overview'); 
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    useEffect(() => {
        if (user && user.userRole !== 'ROLE_ADMIN') navigate('/');
    }, [user, navigate]);

    if (!user || user.userRole !== 'ROLE_ADMIN') return null; 

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-brand"><h2>Admin<span>Panel</span></h2></div>
                <nav className="admin-nav">
                    <ul>
                        <li className={activeView === 'overview' ? 'active' : ''} onClick={() => setActiveView('overview')}>📊 Dashboard</li>
                        <li className={activeView === 'products' ? 'active' : ''} onClick={() => setActiveView('products')}>📦 Productos</li>
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={() => navigate('/')} className="back-store-btn">⬅ Tienda</button>
                    <button onClick={() => { logout(); navigate('/login'); }} className="logout-btn">Salir</button>
                </div>
            </aside>
            <main className="admin-main">
                <header className="top-bar">
                    <div className="breadcrumbs">Admin / {activeView}</div>
                    <div className="admin-profile"><span>{user.username}</span><div className="admin-avatar">A</div></div>
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