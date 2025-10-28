/**
 * JBrowse API 调查工具
 * 用于深度探索 viewState 对象的结构和可用 API
 */

export interface APIInvestigationReport {
  viewStateStructure: {
    keys: string[];
    type: string;
    hasSession: boolean;
    hasConfig: boolean;
  };
  sessionStructure: {
    keys: string[];
    hasViews: boolean;
    viewCount: number;
    sessionMethods: string[];
  };
  viewStructure: {
    keys: string[];
    trackRelatedMethods: string[];
    hasShowTrack: boolean;
    hasHideTrack: boolean;
    hasGetTrack: boolean;
    trackArray: {
      length: number;
      sampleTrack: any;
    };
  };
  configStructure: {
    keys: string[];
    hasAssembly: boolean;
    hasTracks: boolean;
    trackCount: number;
  };
  availableMethods: {
    viewMethods: string[];
    sessionMethods: string[];
  };
}

/**
 * 生成 viewState 的完整调查报告
 */
export function generateJBrowseAPIReport(viewState: any): APIInvestigationReport {
  const report: APIInvestigationReport = {
    viewStateStructure: {
      keys: Object.keys(viewState),
      type: typeof viewState,
      hasSession: !!viewState.session,
      hasConfig: !!viewState.config,
    },
    sessionStructure: {
      keys: viewState.session ? Object.keys(viewState.session) : [],
      hasViews: viewState.session && !!viewState.session.views,
      viewCount: viewState.session?.views?.length || 0,
      sessionMethods: getObjectMethods(viewState.session),
    },
    viewStructure: {
      keys: [],
      trackRelatedMethods: [],
      hasShowTrack: false,
      hasHideTrack: false,
      hasGetTrack: false,
      trackArray: {
        length: 0,
        sampleTrack: null,
      },
    },
    configStructure: {
      keys: viewState.config ? Object.keys(viewState.config) : [],
      hasAssembly: viewState.config && !!viewState.config.assembly,
      hasTracks: viewState.config && !!viewState.config.tracks,
      trackCount: viewState.config?.tracks?.length || 0,
    },
    availableMethods: {
      viewMethods: [],
      sessionMethods: [],
    },
  };

  // 分析 view 结构
  if (viewState.session?.views && viewState.session.views.length > 0) {
    const view = viewState.session.views[0];
    report.viewStructure.keys = Object.keys(view);
    report.viewStructure.trackArray.length = view.tracks?.length || 0;
    report.viewStructure.trackArray.sampleTrack = view.tracks?.[0];

    const viewMethods = getObjectMethods(view);
    report.viewStructure.trackRelatedMethods = viewMethods.filter(
      (m) => m.includes('track') || m.includes('Track')
    );

    report.viewStructure.hasShowTrack = viewMethods.includes('showTrack');
    report.viewStructure.hasHideTrack = viewMethods.includes('hideTrack');
    report.viewStructure.hasGetTrack = viewMethods.includes('getTrack');

    report.availableMethods.viewMethods = viewMethods;
  }

  report.availableMethods.sessionMethods = getObjectMethods(viewState.session);

  return report;
}

/**
 * 从对象中提取所有方法名称
 */
function getObjectMethods(obj: any): string[] {
  if (!obj) return [];

  const methods: string[] = [];

  try {
    // 获取自身属性
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'function') {
        methods.push(key);
      }
    }

    // 获取原型链上的方法
    let proto = Object.getPrototypeOf(obj);
    while (proto && proto !== Object.prototype) {
      for (const key of Object.getOwnPropertyNames(proto)) {
        if (key !== 'constructor' && typeof proto[key] === 'function' && !methods.includes(key)) {
          methods.push(key);
        }
      }
      proto = Object.getPrototypeOf(proto);
    }
  } catch (e) {
    console.warn('Error extracting methods:', e);
  }

  return methods.sort();
}

/**
 * 测试轨道控制方法
 */
export function testTrackControlMethods(viewState: any): {
  canShowTrack: boolean;
  canHideTrack: boolean;
  canGetTrack: boolean;
  canAddTrack: boolean;
  errorMessages: string[];
} {
  const errors: string[] = [];
  const result = {
    canShowTrack: false,
    canHideTrack: false,
    canGetTrack: false,
    canAddTrack: false,
    errorMessages: errors,
  };

  try {
    const view = viewState.session?.views?.[0];
    if (!view) {
      errors.push('Cannot find view in session.views[0]');
      return result;
    }

    // 测试 showTrack
    if (typeof view.showTrack === 'function') {
      result.canShowTrack = true;
    } else {
      errors.push('showTrack method not found or not a function');
    }

    // 测试 hideTrack
    if (typeof view.hideTrack === 'function') {
      result.canHideTrack = true;
    } else {
      errors.push('hideTrack method not found or not a function');
    }

    // 测试 getTrack
    if (typeof view.getTrack === 'function') {
      result.canGetTrack = true;
    } else {
      errors.push('getTrack method not found or not a function');
    }

    // 测试 addTrack (on config)
    if (typeof viewState.config?.addTrackConf === 'function') {
      result.canAddTrack = true;
    } else if (typeof viewState.session?.addTrackConf === 'function') {
      result.canAddTrack = true;
    } else {
      errors.push('addTrackConf method not found on config or session');
    }
  } catch (e) {
    errors.push(`Error during testing: ${e}`);
  }

  return result;
}

/**
 * 获取所有可用轨道的列表
 */
export function getAvailableTracks(viewState: any): any[] {
  try {
    return viewState.config?.tracks || [];
  } catch (e) {
    console.error('Error getting available tracks:', e);
    return [];
  }
}

/**
 * 获取当前视图中显示的轨道
 */
export function getDisplayedTracks(viewState: any): any[] {
  try {
    return viewState.session?.views?.[0]?.tracks || [];
  } catch (e) {
    console.error('Error getting displayed tracks:', e);
    return [];
  }
}
