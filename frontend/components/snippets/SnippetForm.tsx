'use client';

import { FormEvent, useMemo, useState } from 'react';
import { SnippetInput, SnippetType } from '@/types/snippet';
import { normalizeTag } from '@/lib/utils/queryParams';

interface SnippetFormProps {
  mode: 'create' | 'edit';
  initialValues?: SnippetInput;
  submitLabel: string;
  onSubmit: (payload: SnippetInput) => Promise<unknown>;
}

const DEFAULT_VALUES: SnippetInput = {
  title: '',
  content: '',
  tags: [],
  type: 'note',
};

type FormErrors = {
  title?: string;
  content?: string;
  tags?: string;
};

const TITLE_MAX_LENGTH = 120;
const CONTENT_MAX_LENGTH = 5000;
const TAGS_MAX_COUNT = 20;

export function SnippetForm({
  mode,
  initialValues = DEFAULT_VALUES,
  submitLabel,
  onSubmit,
}: SnippetFormProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [content, setContent] = useState(initialValues.content);
  const [type, setType] = useState<SnippetType>(initialValues.type);
  const [tagsText, setTagsText] = useState(initialValues.tags.join(', '));
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tags = useMemo(
    () =>
      Array.from(
        new Set(
          normalizeTag(tagsText)
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
        ),
      ),
    [tagsText],
  );

  const validateForm = (): FormErrors => {
    const nextErrors: FormErrors = {};

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      nextErrors.title = 'Title is required';
    } else if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      nextErrors.title = `Title must be ${TITLE_MAX_LENGTH} characters or less`;
    }

    if (!trimmedContent) {
      nextErrors.content = 'Content is required';
    } else if (trimmedContent.length > CONTENT_MAX_LENGTH) {
      nextErrors.content = `Content must be ${CONTENT_MAX_LENGTH} characters or less`;
    }

    if (tags.length > TAGS_MAX_COUNT) {
      nextErrors.tags = `You can add up to ${TAGS_MAX_COUNT} tags`;
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFormError('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        type,
        tags,
      });
      if (mode === 'create') {
        setTitle('');
        setContent('');
        setType('note');
        setTagsText('');
        setErrors({});
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to submit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-lg border border-slate-200 bg-white p-4"
    >
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        {mode === 'create' ? 'Create new snippet' : 'Edit snippet'}
      </h2>

      <div className="mb-3 grid gap-1">
        <label className="text-sm font-medium text-slate-700">Title *</label>
        <input
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (errors.title) {
              setErrors((prev) => ({ ...prev, title: undefined }));
            }
          }}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          placeholder="Snippet title"
        />
        {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
      </div>

      <div className="mb-3 grid gap-1">
        <label className="text-sm font-medium text-slate-700">Content *</label>
        <textarea
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            if (errors.content) {
              setErrors((prev) => ({ ...prev, content: undefined }));
            }
          }}
          className="min-h-28 resize-none rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          placeholder="Snippet content"
        />
        {errors.content && (
          <p className="text-xs text-red-600">{errors.content}</p>
        )}
      </div>

      <div className="mb-3 grid gap-1">
        <label className="text-sm font-medium text-slate-700">Type *</label>
        <select
          value={type}
          onChange={(event) => setType(event.target.value as SnippetType)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        >
          <option value="note">note</option>
          <option value="link">link</option>
          <option value="command">command</option>
        </select>
      </div>

      <div className="mb-3 grid gap-1">
        <label className="text-sm font-medium text-slate-700">
          Tags (comma separated)
        </label>
        <input
          value={tagsText}
          onChange={(event) => {
            setTagsText(event.target.value);
            if (errors.tags) {
              setErrors((prev) => ({ ...prev, tags: undefined }));
            }
          }}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          placeholder="react, nestjs, tips"
        />
        {errors.tags && <p className="text-xs text-red-600">{errors.tags}</p>}
      </div>

      {formError && (
        <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
