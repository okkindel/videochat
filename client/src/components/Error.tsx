import { ModalPortal, ModalBase } from '@livechat/design-system';
import * as React from 'react';

export function Error({ error }: { error: string }): JSX.Element {
    return error ? (
        <ModalPortal>
            {error && (
                <ModalBase
                    onClose={() => {}}
                    style={{ width: '600px', height: '400px' }}
                >
                    <div style={{ margin: 'auto' }}>{error}</div>
                </ModalBase>
            )}
        </ModalPortal>
    ) : null;
}
