/**
 * @fileoverview useTable Composable 单元测试
 * @description 测试分页列表封装的数据加载、分页、搜索、重置逻辑
 */

import { describe, it, expect, vi } from 'vitest'
import { useTable } from '../useTable'

/** 模拟黑马 API 标准响应结构 { data: { data: { data: [], total: N } } } */
const mockResponse = {
  data: {
    data: {
      data: [
        { id: 1, name: 'item1' },
        { id: 2, name: 'item2' }
      ],
      total: 100
    }
  }
}

describe('useTable 分页列表封装', () => {
  describe('初始化', () => {
    it('默认应立即加载第一页', async () => {
      const fetchFn = vi.fn().mockResolvedValue(mockResponse)
      const { list, total, loading } = useTable(fetchFn)

      expect(fetchFn).toHaveBeenCalledWith({ pagenum: 1, pagesize: 5 })
      await vi.waitFor(() => {
        expect(list.value).toHaveLength(2)
        expect(total.value).toBe(100)
        expect(loading.value).toBe(false)
      })
    })

    it('immediate: false 不应自动加载', () => {
      const fetchFn = vi.fn()
      useTable(fetchFn, { immediate: false })
      expect(fetchFn).not.toHaveBeenCalled()
    })

    it('initialPageSize 应设置默认每页条数', async () => {
      const fetchFn = vi.fn().mockResolvedValue(mockResponse)
      useTable(fetchFn, { initialPageSize: 10 })

      await vi.waitFor(() => {
        expect(fetchFn).toHaveBeenCalledWith({ pagenum: 1, pagesize: 10 })
      })
    })
  })

  describe('分页操作', () => {
    it('onSizeChange 应重置到第一页并更新 pagesize', async () => {
      const fetchFn = vi.fn().mockResolvedValue(mockResponse)
      const { onSizeChange } = useTable(fetchFn)

      await vi.waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(1))
      onSizeChange(10)
      await vi.waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(2))
      expect(fetchFn).toHaveBeenLastCalledWith({ pagenum: 1, pagesize: 10 })
    })

    it('onCurrentChange 应更新页码', async () => {
      const fetchFn = vi.fn().mockResolvedValue(mockResponse)
      const { onCurrentChange } = useTable(fetchFn)

      await vi.waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(1))
      onCurrentChange(3)
      await vi.waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(2))
      expect(fetchFn).toHaveBeenLastCalledWith({ pagenum: 3, pagesize: 5 })
    })
  })

  describe('搜索与重置', () => {
    it('onSearch 应重置到第一页', async () => {
      const fetchFn = vi.fn().mockResolvedValue(mockResponse)
      const { onCurrentChange, onSearch } = useTable(fetchFn)

      await vi.waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(1))
      onCurrentChange(3)
      await vi.waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(2))
      onSearch()
      await vi.waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(3))
      expect(fetchFn).toHaveBeenLastCalledWith({ pagenum: 1, pagesize: 5 })
    })

    it('onReset 应恢复 initialParams 并重置到第一页', async () => {
      const fetchFn = vi.fn().mockResolvedValue(mockResponse)
      const { params, onCurrentChange, onReset } = useTable(fetchFn, {
        initialParams: { cate_id: '', state: '' } as never
      })

      await vi.waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(1))
      // 模拟用户修改筛选条件并翻页
      params.value.cate_id = '5'
      params.value.state = '已发布'
      onCurrentChange(3)
      await vi.waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(2))

      onReset()
      await vi.waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(3))
      expect(fetchFn).toHaveBeenLastCalledWith({
        pagenum: 1,
        pagesize: 5,
        cate_id: '',
        state: ''
      })
    })
  })

  describe('自定义数据提取', () => {
    it('transform 应覆盖默认响应解析', async () => {
      const customResponse = { items: [{ id: 1, name: 'custom' }], count: 50 }
      const fetchFn = vi.fn().mockResolvedValue(customResponse)
      const { list, total, getList } = useTable(fetchFn, {
        immediate: false,
        transform: (res: { items: unknown[]; count: number }) => ({
          list: res.items,
          total: res.count
        })
      })

      await getList()
      expect(list.value).toEqual([{ id: 1, name: 'custom' }])
      expect(total.value).toBe(50)
    })
  })
})
