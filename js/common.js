// common.js - 通用功能
class UserManager {
    static getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('xiaotu_current_user'));
        } catch (e) {
            console.error('获取用户信息失败:', e);
            return null;
        }
    }
    
    static isLoggedIn() {
        return !!this.getCurrentUser();
    }
    
    static logout() {
        localStorage.removeItem('xiaotu_current_user');
        window.location.href = 'index.html';
    }
    
    static updateNavbar() {
        const navContainer = document.querySelector('.nav-container ul');
        if (!navContainer) return;
        
        const currentUser = this.getCurrentUser();
        const loginLi = Array.from(navContainer.children).find(li => 
            li.classList.contains('login') || 
            li.querySelector('a[href="login.html"]') ||
            li.querySelector('.user-info')
        );
        
        if (!loginLi) return;
        
        if (currentUser) {
            loginLi.innerHTML = `
                <div class="user-info">
                    <div class="user-avatar">${(currentUser.nickname || '用户').charAt(0).toUpperCase()}</div>
                    <span>${currentUser.nickname || '用户'}</span>
                    <button class="logout-btn" onclick="UserManager.logout()">退出</button>
                </div>
            `;
            loginLi.classList.remove('login');
        } else {
            loginLi.innerHTML = '<a href="login.html">请先登录</a>';
            loginLi.classList.add('login');
        }
    }
    
    // 通用显示错误消息方法
    static showToast(message, type = 'success') {
        // 移除现有提示
        const existingToast = document.querySelector('.message-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // 创建新提示
        const toast = document.createElement('div');
        toast.className = `message-toast ${type}`;
        toast.textContent = message;
        toast.style.backgroundColor = type === 'success' ? '#4CAF50' : '#ff4444';
        
        document.body.appendChild(toast);
        
        // 3秒后移除
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    }
}

// 标签切换通用函数
class TabManager {
    constructor(options) {
        this.tabButtons = options.tabButtons;
        this.tabContents = options.tabContents;
        this.activeClass = options.activeClass || 'active';
        this.init();
    }
    
    init() {
        this.tabButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.switchTab(index);
            });
        });
    }
    
    switchTab(index) {
        // 隐藏所有内容
        this.tabContents.forEach(content => {
            if (content) content.style.display = 'none';
        });
        
        // 移除所有激活状态
        this.tabButtons.forEach(btn => {
            if (btn) btn.classList.remove(this.activeClass);
        });
        
        // 显示选中内容并激活按钮
        if (this.tabContents[index]) {
            this.tabContents[index].style.display = 'block';
        }
        if (this.tabButtons[index]) {
            this.tabButtons[index].classList.add(this.activeClass);
        }
    }
}

// 表单验证工具
class FormValidator {
    static validatePhone(phone) {
        if (!phone) return '请输入手机号';
        if (!/^1[3-9]\d{9}$/.test(phone)) return '手机号格式不正确';
        return '';
    }
    
    static validatePassword(password) {
        if (!password) return '请输入密码';
        if (password.length < 6 || password.length > 20) return '密码长度应为6-20位';
        return '';
    }
    
    static validateConfirmPassword(password, confirmPassword) {
        if (!confirmPassword) return '请确认密码';
        if (password !== confirmPassword) return '两次输入的密码不一致';
        return '';
    }
}

// 页面加载时更新导航栏
document.addEventListener('DOMContentLoaded', function() {
    UserManager.updateNavbar();
});