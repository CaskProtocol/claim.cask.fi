import React from 'react'
import { Container, TableGrid, MainContent, Section, SectionRow } from '../components/base/base'
import { Title } from '../typography/Title'

// import { AccountButton } from '../components/account/AccountButton'
import { Web3ModalButton } from '../components/account/Web3ModalButton'
import { Summary } from "../components/Claim/Summary";
import {Period} from "../components/Claim/Period";


export function Claim() {

    return (
        <MainContent>
            <Container>
                <Section>
                    <SectionRow>
                        <Title>Claim CASK</Title>
                        <Web3ModalButton />
                    </SectionRow>
                    <TableGrid>
                        <Summary vestedEscrowAddress={'0x3b2b4b547daeebf3a703288cb43650f0f287b9ff'} />
                        <Period vestedEscrowAddress={'0x3b2b4b547daeebf3a703288cb43650f0f287b9ff'} />
                    </TableGrid>
                </Section>
            </Container>
        </MainContent>
    )
}
