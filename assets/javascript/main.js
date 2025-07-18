// 工具数据 - 可以替换为从外部JSON文件加载
const toolsData = {
    "categories": ["设计", "开发", "办公", "学习", "其他"],
    "tools": [
        {
            "name": "Figma",
            "url": "https://www.figma.com",
            "icon": "fas fa-pen-fancy",
            "description": "在线协作设计工具",
            "category": "设计"
        },
        {
            "name": "GitHub",
            "url": "https://github.com",
            "icon": "fab fa-github",
            "description": "代码托管平台",
            "category": "开发"
        },
        {
            "name": "VS Code",
            "url": "https://code.visualstudio.com",
            "icon": "fas fa-code",
            "description": "轻量级代码编辑器",
            "category": "开发"
        },
        {
            "name": "Google Docs",
            "url": "https://docs.google.com",
            "icon": "fas fa-file-word",
            "description": "在线文档编辑工具",
            "category": "办公"
        },
        {
            "name": "Notion",
            "url": "https://www.notion.so",
            "icon": "fas fa-book",
            "description": "一体化工作空间",
            "category": "办公"
        },
        {
            "name": "Coursera",
            "url": "https://www.coursera.org",
            "icon": "fas fa-graduation-cap",
            "description": "在线学习平台",
            "category": "学习"
        },
        {
            "name": "Trello",
            "url": "https://trello.com",
            "icon": "fas fa-tasks",
            "description": "项目管理工具",
            "category": "办公"
        },
        {
            "name": "Dribbble",
            "url": "https://dribbble.com",
            "icon": "fas fa-basketball-ball",
            "description": "设计师作品展示平台",
            "category": "设计"
        },
        {
            "name": "Stack Overflow",
            "url": "https://stackoverflow.com",
            "icon": "fab fa-stack-overflow",
            "description": "开发者问答社区",
            "category": "开发"
        },
        {
            "name": "Canva",
            "url": "https://www.canva.com",
            "icon": "fas fa-palette",
            "description": "在线平面设计工具",
            "category": "设计"
        },
        {
            "name": "MDN Web Docs",
            "url": "https://developer.mozilla.org",
            "icon": "fas fa-file-code",
            "description": "Web开发文档",
            "category": "学习"
        },
        {
            "name": "Google Drive",
            "url": "https://drive.google.com",
            "icon": "fas fa-cloud",
            "description": "云存储服务",
            "category": "办公"
        }
    ]
};

// 从外部加载JSON数据
async function loadToolsData() {
    try {
        const response = await fetch('data/tools.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to load tools data:', error);
        // 使用默认数据作为后备
        return toolsData;
    }
}

// 初始化应用
async function initApp() {
    // 加载数据
    const data = await loadToolsData();
    
    // 渲染分类标签
    renderCategoryTabs(data.categories);
    
    // 渲染所有工具
    renderTools(data.tools);
    
    // 添加事件监听器
    setupEventListeners(data);
}

// 渲染分类标签
function renderCategoryTabs(categories) {
    const tabsContainer = document.getElementById('categoryTabs');
    tabsContainer.innerHTML = '';
    
    // 添加"全部"分类
    const allTab = document.createElement('div');
    allTab.className = 'category-tab active';
    allTab.textContent = '全部';
    allTab.dataset.category = 'all';
    tabsContainer.appendChild(allTab);
    
    // 添加其他分类
    categories.forEach(category => {
        const tab = document.createElement('div');
        tab.className = 'category-tab';
        tab.textContent = category;
        tab.dataset.category = category;
        tabsContainer.appendChild(tab);
    });
}

// 渲染工具卡片
function renderTools(tools) {
    const toolsContainer = document.getElementById('toolsContainer');
    toolsContainer.innerHTML = '';
    
    if (tools.length === 0) {
        toolsContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">没有找到匹配的工具</p>';
        return;
    }
    
    tools.forEach(tool => {
        const toolCard = document.createElement('a');
        toolCard.className = 'tool-card';
        toolCard.href = tool.url;
        toolCard.target = '_blank';
        toolCard.rel = 'noopener noreferrer';
        
        toolCard.innerHTML = `
            <div class="tool-icon">
                ${tool.img 
                    ? `<img src="${tool.img}" alt="${tool.name}" style="width: 24px; height: 24px">` 
                    : `<i class="${tool.icon}"></i>`
                }
            </div>
            <div class="tool-name">${tool.name}</div>
            <div class="tool-desc">${tool.description}</div>
            <div class="tool-category">${tool.category}</div>
        `;
        
        toolsContainer.appendChild(toolCard);
    });
}

// 设置事件监听器
function setupEventListeners(data) {
    // 分类标签点击事件
    document.getElementById('categoryTabs').addEventListener('click', (e) => {
        if (e.target.classList.contains('category-tab')) {
            // 更新活动标签
            document.querySelectorAll('.category-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            e.target.classList.add('active');
            
            // 根据分类过滤工具
            const category = e.target.dataset.category;
            if (category === 'all') {
                renderTools(data.tools);
            } else {
                const filteredTools = data.tools.filter(tool => tool.category === category);
                renderTools(filteredTools);
            }
        }
    });
    
    // 搜索功能
    document.getElementById('searchBtn').addEventListener('click', () => {
        performSearch(data.tools);
    });
    
    document.getElementById('searchInput').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch(data.tools);
        }
    });
}

// 执行搜索
function performSearch(tools) {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        renderTools(tools);
        return;
    }
    
    const filteredTools = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm) || 
        tool.description.toLowerCase().includes(searchTerm) ||
        tool.category.toLowerCase().includes(searchTerm)
    );
    
    renderTools(filteredTools);
}

// 启动应用
document.addEventListener('DOMContentLoaded', initApp);