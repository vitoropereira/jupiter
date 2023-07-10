'use client'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatBytes } from '@/utils/format-bytes'
import {
  DotsHorizontalIcon,
  CrossCircledIcon,
  CheckCircledIcon,
} from '@radix-ui/react-icons'
import { Loader2, TrashIcon } from 'lucide-react'
import { TagInput } from './UploadTagInput'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { useUploads } from '@/hooks/useUploads'
import { SyntheticEvent, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { UploadsFormSchema } from '.'
import { formatSecondsToMinutes } from '@/utils/format-seconds-to-minutes'

export function UploadTable() {
  const {
    register,
    formState: { errors },
  } = useFormContext<UploadsFormSchema>()

  const {
    uploads,
    isRunningAI,
    startUpload,
    remove,
    isUploadsEmpty,
    isThereAnyPendingUpload,
    updateDuration,
  } = useUploads()

  /**
   * Intercept window closing when there is any upload in progress
   */
  useEffect(() => {
    if (isThereAnyPendingUpload) {
      window.onbeforeunload = function () {
        return 'Você possui uploads pendentes. Deseja realmente sair e cancelar TODOS uploads?'
      }
    } else {
      window.onbeforeunload = null
    }
  }, [isThereAnyPendingUpload])

  function handleLoadedMetadata(
    event: SyntheticEvent<HTMLVideoElement>,
    id: string,
  ) {
    updateDuration(id, event.currentTarget.duration)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: 148 }}></TableHead>
            <TableHead>Title</TableHead>
            <TableHead style={{ width: 240 }}>File</TableHead>
            <TableHead style={{ width: 240 }}>Status</TableHead>
            <TableHead style={{ width: 140 }}></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from(uploads).map(([id, upload], index) => {
            return (
              <TableRow key={id}>
                <TableCell>
                  <video
                    src={upload.previewURL}
                    controls={false}
                    className="pointer-events-none aspect-video rounded-md"
                    onLoadedMetadata={(event) =>
                      handleLoadedMetadata(event, id)
                    }
                  />
                </TableCell>
                <TableCell style={{ width: 600 }}>
                  <div className="flex max-w-[420px] flex-col items-start gap-1">
                    <input
                      type="hidden"
                      value={id}
                      {...register(`files.${index}.id`)}
                    />
                    <Input
                      data-error={!!errors.files?.[index]?.title}
                      defaultValue={upload.file.name}
                      className="h-8 data-[error=true]:border-red-400"
                      disabled={isRunningAI}
                      {...register(`files.${index}.title`)}
                    />
                    <TagInput uploadIndex={index} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <span className="truncate">{upload.file.name}</span>
                    <span className="font-medium">
                      {formatBytes(upload.file.size)} -{' '}
                      {upload.duration
                        ? formatSecondsToMinutes(upload.duration)
                        : null}
                    </span>
                  </div>

                  {upload.duration && (
                    <input
                      type="hidden"
                      value={upload.duration}
                      {...register(`files.${index}.duration`)}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {upload.isUploading ? (
                    <Progress
                      max={100}
                      value={upload.uploadProgress}
                      className="transition-all"
                    />
                  ) : (
                    <div className="flex items-center font-medium">
                      {upload.uploadProgress === 0 && !upload.hasError ? (
                        <>
                          <DotsHorizontalIcon className="mr-2 h-4 w-4" />
                          <span className="text-muted-foreground">
                            Waiting upload
                          </span>
                        </>
                      ) : upload.hasError ? (
                        <>
                          <CrossCircledIcon className="mr-2 h-4 w-4 text-red-500" />
                          <span className="text-red-500">
                            Upload error{' '}
                            <Button
                              variant="link"
                              className="inline p-0 text-inherit"
                              onClick={() => startUpload(id)}
                            >
                              (Retry)
                            </Button>
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircledIcon className="mr-2 h-4 w-4 text-emerald-500" />
                          <span className="text-emerald-500">
                            Upload complete
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => remove(id)}
                    size="sm"
                    variant="destructive"
                    disabled={upload.isRemoving}
                  >
                    {upload.isRemoving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <TrashIcon className="mr-2 h-4 w-4" />
                    )}
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}

          {isUploadsEmpty && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No videos selected.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}