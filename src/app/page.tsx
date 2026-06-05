import React from 'react';
import './page.css';

export default function Home() {
  return (
    <main className="container main-content">
      <header className="header delay-100">
        <div className="logo">
          <div className="logo-icon"></div>
          <h1>Trackexpense</h1>
        </div>
        <nav className="nav">
          <button className="btn-secondary">Log In</button>
          <button className="btn-primary">Get Started</button>
        </nav>
      </header>

      <section className="hero delay-200">
        <h2 className="hero-title">
          Master Your Money with <span className="text-gradient">Precision</span>
        </h2>
        <p className="hero-subtitle">
          Trackexpense is the premium, intelligent expense tracker designed for individuals who demand clarity, beautiful aesthetics, and total control over their finances.
        </p>
        <div className="hero-actions">
          <button className="btn-primary">Start Tracking Now</button>
        </div>
      </section>

      <section className="dashboard-preview delay-300 glass-panel">
        <div className="dashboard-header">
          <h3>Recent Transactions</h3>
          <span className="balance">Total Balance: $12,450.00</span>
        </div>

        <div className="transaction-list">
          <div className="transaction-item">
            <div className="tx-info">
              <div className="tx-icon bg-blue">🛒</div>
              <div>
                <h4>Grocery Store</h4>
                <p>May 24, 2026</p>
              </div>
            </div>
            <div className="tx-amount tx-danger">-$120.50</div>
          </div>

          <div className="transaction-item">
            <div className="tx-info">
              <div className="tx-icon bg-green">💼</div>
              <div>
                <h4>Salary Deposit</h4>
                <p>May 22, 2026</p>
              </div>
            </div>
            <div className="tx-amount tx-success">+$4,200.00</div>
          </div>

          <div className="transaction-item">
            <div className="tx-info">
              <div className="tx-icon bg-purple">🎬</div>
              <div>
                <h4>Netflix Subscription</h4>
                <p>May 20, 2026</p>
              </div>
            </div>
            <div className="tx-amount tx-danger">-$15.99</div>
          </div>
        </div>
      </section>
    </main>
  );
}
