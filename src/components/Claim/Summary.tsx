import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import React, {useEffect, useState} from 'react'
import {
    SmallContentBlock,
    ContentRow,
    ContentBlock
} from '../base/base'
import { useContractFunction, useEthers, useCall } from '@usedapp/core'

import CaskVestedEscrow from '../../abi/CaskVestedEscrow.json'
import {LabelRow, Label, LargeLabel} from "../../typography/Label";
import {TextBold, TextInline} from "../../typography/Text";
import {commify, formatUnits} from "@ethersproject/units";
import type { BigNumber } from "@ethersproject/bignumber";
import styled from "styled-components";
import {Colors} from "../../global/styles";
import {Button} from "../base/Button";

const cveInterface = new utils.Interface(CaskVestedEscrow)

interface ClaimSummaryProps {
    vestedEscrowAddress: string
}

export const Summary = ({vestedEscrowAddress} : ClaimSummaryProps) => {
    const { account } = useEthers()

    const contract = new Contract(vestedEscrowAddress, cveInterface)

    const [disabled, setDisabled] = useState(false)
    const { state, send } = useContractFunction(contract, 'claim',
        { transactionName: 'Claim'})

    const claimableBalance = getBalancedOf(contract, account)
    const totalBalance = getInitialLocked(contract, account)
    const lockedBalance = getLockedOf(contract, account)
    const claimedBalance = getTotalClaimed(contract, account)

    const handleClaim = () => {
        setDisabled(true)
        send()
    }

    useEffect(() => {
        if (claimableBalance && claimableBalance > 0 && state.status != 'Mining') {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [claimableBalance, state])

    return (
        <SmallContentBlock>
            <TitleRow>
                <CellTitle>Team Vesting</CellTitle>
            </TitleRow>
            {totalBalance > 0 ?
                <ContentBlock>
                    <LabelRow>
                        <LargeLabel>Available Now</LargeLabel>
                    </LabelRow>
                    <LabelRow>
                        <LargeLabel>{claimableBalance ? formatCask(claimableBalance) : '...'}</LargeLabel>
                        <LargeLabel>&nbsp;CASK</LargeLabel>
                    </LabelRow>
                    <LabelRow>
                        <SmallButton disabled={!account || disabled} onClick={handleClaim}>
                            Claim
                        </SmallButton>
                    </LabelRow>
                    <ContentRow>
                        <Label>Total:</Label> <TextInline>{totalBalance ? formatCask(totalBalance) : '...'}</TextInline>{' '}
                        <Label>CASK</Label>
                    </ContentRow>
                    <ContentRow>
                        <Label>Locked:</Label> <TextInline>{lockedBalance ? formatCask(lockedBalance) : '...'}</TextInline>{' '}
                        <Label>CASK</Label>
                    </ContentRow>
                    <ContentRow>
                        <Label>Claimed:</Label> <TextInline>{claimedBalance ? formatCask(claimedBalance) : '...'}</TextInline>{' '}
                        <Label>CASK</Label>
                    </ContentRow>

                </ContentBlock>
                : account ? <ContentBlock>Who are you?</ContentBlock> :
                    <ContentBlock>Please connect wallet</ContentBlock>
            }
        </SmallContentBlock>
    )
}


function formatCask(value: BigNumber): string {
    return commify(formatUnits(value.sub(value.mod(1e14)), 18))
}


function getBalancedOf(contract: Contract, account: string | null | undefined) {
    const { value, error } = useCall(
        account &&
        {
            contract: contract,
            method: 'balanceOf',
            args: [account],
        }
    ) ?? {}
    if(error) {
        console.error(error.message)
        return undefined
    }
    return value?.[0]
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

function getLockedOf(contract: Contract, account: string | null | undefined) {
    const { value, error } = useCall(
        account &&
        {
            contract: contract,
            method: 'lockedOf',
            args: [account],
        }
    ) ?? {}
    if(error) {
        console.error(error.message)
        return undefined
    }
    return value?.[0]
}

function getTotalClaimed(contract: Contract, account: string | null | undefined) {
    const { value, error } = useCall(
        account &&
        {
            contract: contract,
            method: 'totalClaimed',
            args: [account],
        }
    ) ?? {}
    if(error) {
        console.error(error.message)
        return undefined
    }
    return value?.[0]
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