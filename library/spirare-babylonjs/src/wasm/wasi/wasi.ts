import { getMemory } from '../utilities/webAssemblyHelper'
import { argsGetFactory } from './wasiArgsGet'
import * as wasiClock from './wasiClock'
import { environGetFactory } from './wasiEnvironGet'
import * as wasiFileDescriptor from './wasiFileDescriptor'
import { ErrorNo, ERROR_NO } from './wasiTypes'

const proc_exit = (a: number, b: number) => {
  // TODO
  // console.log('proc_exit')
}

const random_get = (
  memory: ArrayBuffer,
  bufPtr: number,
  bufLen: number
): ErrorNo => {
  const buffer = new Uint8Array(memory, bufPtr, bufLen)
  crypto.getRandomValues(buffer)
  return ERROR_NO.Success
}

export class Wasi {
  instance?: WebAssembly.Instance

  private argsGet: (
    memory: ArrayBuffer,
    argvPtr: number,
    argvBufPtr: number
  ) => ErrorNo

  private argsSizesGet: (
    memory: ArrayBuffer,
    sizePtr: number,
    bufferSizePtr: number
  ) => ErrorNo

  private environGet: (
    memory: ArrayBuffer,
    environPtr: number,
    environBufPtr: number
  ) => ErrorNo

  private environSizesGet: (
    memory: ArrayBuffer,
    sizePtr: number,
    bufferSizePtr: number
  ) => ErrorNo

  constructor(config: { env: Map<string, string>; args: string[] }) {
    const { argsGet, argsSizesGet } = argsGetFactory(config.args)
    this.argsGet = argsGet
    this.argsSizesGet = argsSizesGet

    const { environGet, environSizesGet } = environGetFactory(config.env)
    this.environGet = environGet
    this.environSizesGet = environSizesGet
  }

  public setInstance(instance: WebAssembly.Instance) {
    this.instance = instance
  }

  public getImports() {
    const notImpl = (funcname: string) => {
      return (...args: number[]): ErrorNo => {
        console.warn(`wasi function '${funcname}' is not implemented yet.`)
        return ERROR_NO.Inval
      }
    }

    return {
      wasi_snapshot_preview1: {
        args_get: this.createWasmFunc(this.argsGet),
        args_sizes_get: this.createWasmFunc(this.argsSizesGet),
        environ_get: this.createWasmFunc(this.environGet),
        environ_sizes_get: this.createWasmFunc(this.environSizesGet),
        clock_res_get: this.createWasmFunc(wasiClock.clock_res_get),
        clock_time_get: this.createWasmFunc(wasiClock.clock_time_get),
        fd_advise: notImpl('fd_advise'),
        fd_allocate: notImpl('fd_allocate'),
        fd_close: notImpl('fd_close'),
        fd_datasync: notImpl('fd_datasync'),
        fd_fdstat_get: notImpl('fd_fdstat_get'),
        fd_fdstat_set_flags: notImpl('fd_fdstat_set_flags'),
        fd_fdstat_set_rights: notImpl('fd_fdstat_set_rights'),
        fd_filestat_get: notImpl('fd_filestat_get'),
        fd_filestat_set_size: notImpl('fd_filestat_set_size'),
        fd_filestat_set_times: notImpl('fd_filestat_set_times'),
        fd_pread: notImpl('fd_pread'),
        fd_prestat_get: this.createWasmFunc(wasiFileDescriptor.fd_prestat_get),
        fd_prestat_dir_name: notImpl('fd_prestat_dir_name'),
        fd_pwrite: notImpl('fd_pwrite'),
        fd_read: notImpl('fd_read'),
        fd_readdir: notImpl('fd_readdir'),
        fd_renumber: notImpl('fd_renumber'),
        fd_seek: notImpl('fd_seek'),
        fd_sync: notImpl('fd_sync'),
        fd_tell: notImpl('fd_tell'),
        fd_write: this.createWasmFunc(wasiFileDescriptor.fd_write),
        path_create_directory: notImpl('path_create_directory'),
        path_filestat_get: notImpl('path_filestat_get'),
        path_filestat_set_times: notImpl('path_filestat_set_times'),
        path_link: notImpl('path_link'),
        path_open: notImpl('path_open'),
        path_readlink: notImpl('path_readlink'),
        path_remove_directory: notImpl('path_remove_directory'),
        path_rename: notImpl('path_rename'),
        path_symlink: notImpl('path_symlink'),
        path_unlink_file: notImpl('path_unlink_file'),
        poll_oneoff: notImpl('poll_oneoff'),
        proc_exit,
        proc_raise: notImpl('proc_raise'),
        sched_yield: notImpl('sched_yield'),
        random_get: this.createWasmFunc(random_get),
        sock_accept: notImpl('sock_accept'),
        sock_recv: notImpl('sock_recv'),
        sock_send: notImpl('sock_send'),
        sock_shutdown: notImpl('sock_shutdown'),
      },
    }
  }

  private getMemory(): ArrayBuffer | undefined {
    return getMemory(this.instance)
  }

  private createWasmFunc(
    func: (memory: ArrayBuffer, ...args: number[]) => ErrorNo
  ): (...args: number[]) => ErrorNo {
    return (...args: number[]) => {
      const memory = this.getMemory()
      if (memory === undefined) {
        return ERROR_NO.Inval
      }

      return func(memory, ...args)
    }
  }
}
