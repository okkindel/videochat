import { Container, Content, Tank } from "../styles";
import { Loader } from "@livechat/design-system";
import * as React from 'react';

export function Loading() {
    return (
        <Container>
            <Tank>
                <Content>
                    <Loader size='large' />
                </Content>
            </Tank>
        </Container>
    );
}