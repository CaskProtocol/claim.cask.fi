import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import React from 'react'
import {
    SmallContentBlock,
    ContentBlock, CenterContentRow
} from '../base/base'
import { useEthers, useCall } from '@usedapp/core'

import CaskVestedEscrow from '../../abi/CaskVestedEscrow.json'
import {LabelRow, Label, LargeLabel} from "../../typography/Label";
import {TextBold, TextInline} from "../../typography/Text";
import styled from "styled-components";
import {Colors} from "../../global/styles";
import {Button} from "../base/Button";

const cveInterface = new utils.Interface(CaskVestedEscrow)

interface ClaimSummaryProps {
    vestedEscrowAddress: string
}

export const Period = ({vestedEscrowAddress} : ClaimSummaryProps) => {
    const { account } = useEthers()

    const contract = new Contract(vestedEscrowAddress, cveInterface)

    const totalBalance = getInitialLocked(contract, account)

    const startedAt = getStartedAt(contract, account)
    const cliffAt = getCliffAt(contract, account)
    const duration = getDuration(contract)
    const endAt = startedAt + duration


    return (
        <SmallContentBlock>
            <TitleRow>
                <CellTitle>Vesting Schedule</CellTitle>
            </TitleRow>
            {totalBalance > 0 ?
                <ContentBlock>
                    <LabelRow>
                        <LargeLabel>Vesting Start</LargeLabel>
                    </LabelRow>
                    <CenterContentRow>
                        <TextInline>{startedAt != undefined ? formatDate(startedAt) : '...'}</TextInline>
                    </CenterContentRow>
                    <LabelRow>
                        <LargeLabel>Cliff</LargeLabel>
                    </LabelRow>
                    <CenterContentRow>
                        <TextInline>{cliffAt ? formatDate(cliffAt) : '...'}</TextInline>
                    </CenterContentRow>
                    <LabelRow>
                        <LargeLabel>Vesting End</LargeLabel>
                    </LabelRow>
                    <CenterContentRow>
                        <TextInline>{endAt ? formatDate(endAt) : '...'}</TextInline>
                    </CenterContentRow>
                </ContentBlock>
                : account ? <ContentBlock>Who are you?</ContentBlock> :
                    <ContentBlock>Please connect wallet</ContentBlock>
            }
        </SmallContentBlock>
    )
}


function formatDate(timestamp: number): string {
    console.log(`timestamp is ${timestamp}`)
    return new Date(timestamp*1000).toLocaleString()
}


function getInitialLocked(contract: Contract, account: string | null | undefined) {
    const { value, error } = useCall(
        account &&
        {
            contract: contract,
            method: 'initialLocked',
            args: [account],
        }
    ) ?? {}
    if(error) {
        console.error(error.message)
        return undefined
    }
    return value?.[0]
}

function getStartedAt(contract: Contract, account: string | null | undefined): number {
    const { value, error } = useCall(
        account &&
        {
            contract: contract,
            method: 'startedAt',
            args: [account],
        }
    ) ?? {}
    if(error) {
        console.error(error.message)
        return 0
    }
    return parseInt(value?.[0] || 0)
}

function getCliffAt(contract: Contract, account: string | null | undefined): number {
    const { value, error } = useCall(
        account &&
        {
            contract: contract,
            method: 'cliffAt',
            args: [account],
        }
    ) ?? {}
    if(error) {
        console.error(error.message)
        return 0
    }
    return parseInt(value?.[0] || 0)
}

function getDuration(contract: Contract): number {
    const { value, error } = useCall(
        {
            contract: contract,
            method: 'duration',
            args: [],
        }
    ) ?? {}
    if(error) {
        console.error(error.message)
        return 0
    }
    return parseInt(value?.[0] || 0)
}


const CellTitle = styled(TextBold)`
  font-size: 18px;
`

const TitleRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: ${Colors.Gray['300']} 1px solid;
  padding: 16px;
`


const SmallButton = styled(Button)`
  display: flex;
  justify-content: center;
  min-width: 95px;
  height: unset;
  padding: 8px 24px;

  &:disabled {
    color: ${Colors.Gray['600']};
    cursor: unset;
  }

  &:disabled:hover,
  &:disabled:focus {
    background-color: unset;
    color: unset;
  }
`