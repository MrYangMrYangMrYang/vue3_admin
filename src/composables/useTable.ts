/**
 * @fileoverview useTable 分页列表 Composable
 * @description 封装分页列表的通用逻辑：列表数据、总数、分页、搜索、重置
 * @version 1.0.0
 *
 * @example
 * ```typescript
 * const { list, total, loading, params, onSearch, onReset } = useTable(
 *   artGetListService,
 *   { initialParams: { cate_id: '', state: '' }, initialPageSize: 5 }
 * )
 * ```
 */

import { ref, type Ref } from 'vue'

/**
 * 分页参数基础类型约束
 * @description 所有分页请求参数必须包含 pagenum 和 pagesize
 */
interface PageParams {
  /** 当前页码（从 1 开始） */
  pagenum: number
  /** 每页显示条数 */
  pagesize: number
}

/**
 * useTable 配置项
 */
interface UseTableOptions<P, R> {
  /** 初始查询参数（除 pagenum/pagesize 外的筛选条件，如 cate_id、state） */
  initialParams?: Partial<Omit<P, keyof PageParams>>
  /** 初始每页条数（默认 5） */
  initialPageSize?: number
  /** 是否立即加载第一页（默认 true） */
  immediate?: boolean
  /**
   * 自定义响应数据提取
   * @description 默认从 res.data.data.{data, total} 提取，不符合时用此函数覆盖
   */
  transform?: (res: unknown) => { list: R[]; total: number }
}

/**
 * useTable 返回值
 */
interface UseTableReturn<P extends PageParams, R> {
  /** 列表数据 */
  list: Ref<R[]>
  /** 数据总条数 */
  total: Ref<number>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 查询参数（含分页 + 筛选条件） */
  params: Ref<P>
  /** 重新获取列表数据 */
  getList: () => Promise<void>
  /** 每页条数变化（自动重置到第一页） */
  onSizeChange: (size: number) => void
  /** 页码变化 */
  onCurrentChange: (page: number) => void
  /** 搜索（自动重置到第一页） */
  onSearch: () => void
  /** 重置筛选条件并重新加载（自动重置到第一页） */
  onReset: () => void
}

/**
 * 分页列表 Composable
 * @description 封装分页表格的通用逻辑，消除列表页重复代码
 *
 * @param fetchFn - 列表请求函数，接收 params，返回响应数据
 * @param options - 配置项
 * @returns 列表状态与分页操作方法
 *
 * @remarks
 * **默认响应结构**（黑马 API 标准）：
 * ```json
 * { "data": { "data": [...], "total": 100 } }
 * ```
 * 若后端结构不同，通过 `transform` 选项自定义提取。
 *
 * @example
 * ```typescript
 * // 文章管理页
 * const { list, total, loading, params, onSearch, onReset } = useTable(
 *   artGetListService,
 *   {
 *     initialParams: { cate_id: '', state: '' },
 *     initialPageSize: 5
 *   }
 * )
 * ```
 */
export function useTable<P extends PageParams, R>(
  fetchFn: (params: P) => Promise<unknown>,
  options: UseTableOptions<P, R> = {}
): UseTableReturn<P, R> {
  // 初始化查询参数：分页 + 筛选条件
  const params = ref({
    pagenum: 1,
    pagesize: options.initialPageSize ?? 5,
    ...options.initialParams
  }) as Ref<P>

  const list = ref<R[]>([]) as Ref<R[]>
  const total = ref(0)
  const loading = ref(false)

  /**
   * 获取列表数据
   * @description 根据 params 调用 fetchFn，自动维护 loading 状态
   */
  const getList = async (): Promise<void> => {
    loading.value = true
    try {
      const res = await fetchFn(params.value)
      if (options.transform) {
        const result = options.transform(res)
        list.value = result.list
        total.value = result.total
      } else {
        // 默认从 res.data.data.{data, total} 提取（黑马 API 标准结构）
        // 使用可选链兜底，避免后端返回结构异常时整页崩溃
        const payload = (
          res as { data?: { data?: { data?: R[]; total?: number } } }
        )?.data?.data
        list.value = payload?.data ?? []
        total.value = payload?.total ?? 0
      }
    } finally {
      loading.value = false
    }
  }

  /** 每页条数变化：重置到第一页 */
  const onSizeChange = (size: number): void => {
    params.value.pagenum = 1
    params.value.pagesize = size
    getList()
  }

  /** 页码变化 */
  const onCurrentChange = (page: number): void => {
    params.value.pagenum = page
    getList()
  }

  /** 搜索：重置到第一页 */
  const onSearch = (): void => {
    params.value.pagenum = 1
    getList()
  }

  /** 重置：筛选条件恢复初始值并重置到第一页 */
  const onReset = (): void => {
    params.value.pagenum = 1
    if (options.initialParams) {
      Object.assign(params.value, options.initialParams)
    }
    getList()
  }

  // 默认立即加载第一页
  if (options.immediate !== false) {
    getList()
  }

  return {
    list,
    total,
    loading,
    params,
    getList,
    onSizeChange,
    onCurrentChange,
    onSearch,
    onReset
  }
}
