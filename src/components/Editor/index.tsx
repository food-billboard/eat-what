import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
} from 'react';
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IToolbarConfig } from '@wangeditor/editor';
import { isNil } from 'lodash';
import type { IEditorConfig, IDomEditor } from '@wangeditor/editor';
import classnames from 'classnames';
import { uploadFile } from '@/utils/Upload';
import styles from './index.less';

export interface RichTextProps {
  // defaultContent?: SlateDescendant[];
  onCreated?: (editor: IDomEditor) => void;
  defaultValue?: string;
  value?: string;
  onChange?: (html: string, editor: IDomEditor) => void;
  defaultConfig?: Partial<IEditorConfig>;
  defaultToolbarConfig?: Partial<IToolbarConfig>;
  mode?: string;
  toolbarMode?: string;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  toolbarVisible?: boolean;
}

const RichText = forwardRef<IDomEditor, RichTextProps>((props, ref) => {
  const {
    onChange: propsOnChange,
    onCreated: propsOnCreated,
    value,
    className,
    style,
    defaultValue,
    defaultConfig,
    defaultToolbarConfig = {},
    toolbarMode = 'default',
    mode = 'default',
    disabled = false,
    toolbarVisible = true,
    ...nextProps
  } = props;

  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法

  // 编辑器内容
  const [html, setHtml] = useState(value || defaultValue || '');

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = useMemo(() => {
    return {
      ...defaultToolbarConfig,
    };
  }, [defaultToolbarConfig]);

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = useMemo(() => {
    return {
      readOnly: disabled,
      autoFocus: false,
      placeholder: '请输入内容...',
      MENU_CONF: {
        uploadImage: {
          customBrowseAndUpload: async (
            insertFn: (url: string, alt?: string, href?: string) => void,
          ) => {
            uploadFile({
              accept: 'image/*',
              uploadEnd: async (filePath) => {
                insertFn(filePath);
              },
            });
          },
        },
        uploadVideo: {
          customBrowseAndUpload: async (
            insertFn: (url: string, poster?: string) => void,
          ) => {
            uploadFile({
              accept: 'video/*',
              uploadEnd: async (filePath) => {
                insertFn(filePath);
              },
            });
          },
        },
      },
      ...defaultConfig,
    };
  }, [defaultConfig, disabled]);

  const onCreated = useCallback(
    (editor: any) => {
      setEditor(editor);
      propsOnCreated?.(editor);
    },
    [propsOnCreated],
  );

  const onChange = useCallback(
    (editor: any) => {
      const html = editor.getHtml();
      setHtml(html);
      propsOnChange?.(html, editor);
    },
    [propsOnChange],
  );

  useImperativeHandle(
    ref,
    () => {
      return editor!;
    },
    [editor],
  );

  useEffect(() => {
    !isNil(value) && setHtml(value);
  }, [value]);

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  // useEffect(() => {
  //   if(editor) {
  //     if(disabled) {
  //       editor.disable()
  //     }else {
  //       editor.enable()
  //     }
  //   }
  // }, [editor, disabled])

  return (
    <div className={classnames(styles['rich'], className)} style={style}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode={toolbarMode}
        className={styles['rich-toolbar']}
        style={{
          pointerEvents: disabled ? 'none' : 'all',
          display: toolbarVisible ? 'block' : 'none',
        }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={html}
        onCreated={onCreated}
        onChange={onChange}
        mode={mode}
        className={styles['rich-editor']}
        {...nextProps}
      />
    </div>
  );
});

export default RichText;
